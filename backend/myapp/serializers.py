from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Account, Transaction, Transfer, UserProfile


# Serializer for the Account model — exposes key fields for the REST API
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'account_number', 'account_type', 'balance', 'nickname', 'status']
        read_only_fields = ['id']


# Serializer for the Transfer model — used when creating or viewing transfers
class TransferSerializer(serializers.ModelSerializer):
    to_account_number = serializers.CharField(write_only=True)
    from_account_number = serializers.CharField(source='from_account.account_number', read_only=True)
    to_account_display = serializers.CharField(source='to_account.account_number', read_only=True)

    class Meta:
        model = Transfer
        fields = ['id', 'from_account', 'from_account_number', 'to_account', 'to_account_number', 'to_account_display', 'amount', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at', 'to_account']

    def validate_to_account_number(self, value):
        # Verify that the destination account exists
        try:
            return Account.objects.get(account_number=value)
        except Account.DoesNotExist:
            raise serializers.ValidationError("Destination account not found.")

    def create(self, validated_data):
        # map to_account_number (which is now an Account object) to to_account
        validated_data['to_account'] = validated_data.pop('to_account_number')
        return super().create(validated_data)


# Serializer for the Transaction model — exposes transaction history fields
class TransactionSerializer(serializers.ModelSerializer):
    # Include the account number for display in transaction history table
    account_number = serializers.CharField(source='account.account_number', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'account', 'account_number', 'transaction_type', 'amount', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']


# Serializer for UserProfile — exposes profile fields editable by the user
class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    fullname = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'fullname', 'phone', 'address', 'date_of_birth', 'profile_picture']
        read_only_fields = ['username', 'email', 'date_of_birth']

    def get_fullname(self, obj):
        # Return full name from Django User if available, else fall back to username
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def update(self, instance: UserProfile, validated_data):
        # Allow updating phone and address fields from the profile model
        instance.phone = validated_data.get('phone', instance.phone)
        instance.address = validated_data.get('address', instance.address)
        
        # Handle profile picture if provided in the update
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data['profile_picture']
            
        instance.save()

        # Also update first/last name on the User model if fullname is provided
        fullname = self.initial_data.get('fullname', '')
        if fullname:
            parts = fullname.split(' ', 1)
            instance.user.first_name = parts[0]
            instance.user.last_name = parts[1] if len(parts) > 1 else ''
            instance.user.save()

        return instance


# Serializer for registering a new user — used by RegisterView
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_username(self, value: str):
        # Ensure username is unique before creating the account
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

    def create(self, validated_data: dict):
        # Create the Django User and a linked UserProfile
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        # Create a UserProfile with blank defaults so it exists from registration
        UserProfile.objects.create(
            user=user,
            phone='',
            address='',
            date_of_birth='2000-01-01',
        )
        return user


# Serializer for returning authenticated user data after login/register
class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff']
        read_only_fields = ['id', 'username', 'email', 'is_staff']
