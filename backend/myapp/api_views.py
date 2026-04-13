import logging

from django.db import transaction as db_transaction
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Account, Transaction, Transfer, UserProfile
from .serializers import (
    AccountSerializer,
    AuthUserSerializer,
    RegisterSerializer,
    TransactionSerializer,
    TransferSerializer,
    UserProfileSerializer,
)

logger = logging.getLogger(__name__)


class AccountListView(APIView):
    """List all accounts belonging to the authenticated user."""
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer

    def get(self, request: Request):
        """Return the authenticated user's bank accounts."""
        accounts = Account.objects.filter(user=request.user)
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)

    def post(self, request: Request):
        """Create a new bank account for the authenticated user (staff only)."""
        if not request.user.is_staff:
            return Response({'detail': 'Only staff can create accounts.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        account = serializer.save(user=request.user)
        logger.info('Account created: %s by %s', account.account_number, request.user.username)
        return Response(AccountSerializer(account).data, status=status.HTTP_201_CREATED)


class AccountDetailView(APIView):
    """Retrieve or delete a specific bank account."""
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer

    def get(self, request: Request, account_id: int):
        """Return a single account belonging to the authenticated user."""
        account = get_object_or_404(Account, id=account_id)
        
        # Explicit object-level permission check (Requirement Q2)
        if account.user != request.user and not request.user.is_staff:
            return Response({'detail': 'You do not have permission to view this account.'}, status=status.HTTP_403_FORBIDDEN)
            
        return Response(AccountSerializer(account).data)

    def put(self, request: Request, account_id: int):
        """Update an account (e.g., nickname) — Requirement Q1/Q2 PUT method."""
        account = get_object_or_404(Account, id=account_id)
        
        # Ensure only the owner can update their account metadata
        if account.user != request.user:
            return Response({'detail': 'You can only update your own accounts.'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = AccountSerializer(account, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        logger.info('Account %s updated by %s', account.account_number, request.user.username)
        return Response(serializer.data)

    @extend_schema(responses={204: None})
    def delete(self, request: Request, account_id: int):
        """Delete an account — staff only."""
        account = get_object_or_404(Account, id=account_id)
        if not request.user.is_staff:
            return Response({'detail': 'Only staff can delete accounts.'}, status=status.HTTP_403_FORBIDDEN)
        account.delete()
        logger.info('Account deleted: %s by %s', account_id, request.user.username)
        return Response(status=status.HTTP_204_NO_CONTENT)


class TransferListView(APIView):
    """List past transfers or submit a new fund transfer."""
    permission_classes = [IsAuthenticated]
    serializer_class = TransferSerializer

    def get(self, request: Request):
        """Return all transfers involving the authenticated user's accounts."""
        user_accounts = Account.objects.filter(user=request.user)
        transfers = Transfer.objects.filter(from_account__in=user_accounts).order_by('-created_at')
        serializer = TransferSerializer(transfers, many=True)
        return Response(serializer.data)

    def post(self, request: Request):
        """
        Submit a fund transfer between two accounts.
        Validates balance, updates both accounts atomically, and records a Transaction.
        """
        serializer = TransferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from_account = get_object_or_404(Account, id=request.data.get('from_account'), user=request.user)
        to_account = serializer.validated_data['to_account_number']
        amount = serializer.validated_data['amount']

        # Validate that the source account has sufficient funds
        if from_account.balance < amount:
            return Response({'detail': 'Insufficient funds.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that source and destination accounts are not the same
        if from_account == to_account:
            return Response({'detail': 'Cannot transfer to the same account.'}, status=status.HTTP_400_BAD_REQUEST)

        # Perform balance update atomically to prevent data inconsistency
        with db_transaction.atomic():
            from_account.balance -= amount
            from_account.save()
            to_account.balance += amount
            to_account.save()

            # Create the transfer record
            transfer = serializer.save(from_account=from_account)

            # Record debit transaction on the source account
            Transaction.objects.create(
                account=from_account,
                transaction_type='Transfer Out',
                amount=amount,
                status='Completed',
            )

            # Record credit transaction on the destination account
            Transaction.objects.create(
                account=to_account,
                transaction_type='Transfer In',
                amount=amount,
                status='Completed',
            )

        logger.info('Transfer of %.2f from account %s to %s by %s',
                    amount, from_account.account_number, to_account.account_number, request.user.username)

        return Response(TransferSerializer(transfer).data, status=status.HTTP_201_CREATED)


class TransactionListView(APIView):
    """List all transactions for the authenticated user's accounts."""
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    def get(self, request: Request):
        """Return all transactions linked to the authenticated user's accounts."""
        user_accounts = Account.objects.filter(user=request.user)
        transactions = Transaction.objects.filter(account__in=user_accounts).order_by('-created_at')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class ProfileView(APIView):
    """View or update the authenticated user's profile."""
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get(self, request: Request):
        """Return the authenticated user's profile."""
        profile = get_object_or_404(UserProfile, user=request.user)
        return Response(UserProfileSerializer(profile).data)

    def patch(self, request: Request):
        """Update the authenticated user's profile (phone, address, fullname)."""
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserProfileSerializer(profile).data)


class ProfilePhotoView(APIView):
    """View or update the authenticated user's profile photo."""
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        """Return the authenticated user's profile photo."""
        profile = get_object_or_404(UserProfile, user=request.user)
        if not profile.profile_picture:
            return Response({'detail': 'No profile photo set.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Open and return the image file using Django's FileResponse
        return FileResponse(profile.profile_picture.open(), content_type='image/jpeg')

    def post(self, request: Request):
        """Upload or update the authenticated user's profile photo."""
        profile = get_object_or_404(UserProfile, user=request.user)
        if 'file' not in request.FILES:
            return Response({'detail': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile.profile_picture = request.FILES['file']
        profile.save()
        logger.info('Profile photo updated for user: %s', request.user.username)
        return Response({'detail': 'Photo uploaded successfully.'}, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """Register a new user account."""
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    @extend_schema(responses={201: AuthUserSerializer})
    def post(self, request: Request):
        """Create a new user account and return the user data."""
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        logger.info('New user registered: %s', user.username)
        return Response(AuthUserSerializer(user).data, status=status.HTTP_201_CREATED)
