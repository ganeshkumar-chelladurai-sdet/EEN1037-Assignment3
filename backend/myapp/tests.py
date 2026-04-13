from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Account, Transaction, Transfer, UserProfile

class BankingAPITests(TestCase):
    """
    Comprehensive test suite for the Banking REST API.
    Fulfills Q4 requirement: 6+ test cases, covering each endpoint.
    """

    def setUp(self):
        self.client = APIClient()
        # Ordinary user
        self.user = User.objects.create_user(username='john', password='password123')
        self.profile = UserProfile.objects.create(user=self.user, date_of_birth='1990-01-01')
        self.account = Account.objects.create(
            user=self.user, account_number='DUB-1001', account_type='Current', 
            balance=1000.00, status='Active'
        )
        
        # Staff user
        self.staff_user = User.objects.create_superuser(username='admin', password='password123', email='admin@dub.ie')

    # 1. GET /api/accounts/ (List)
    def test_list_accounts(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/accounts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    # 2. POST /api/accounts/ (Create - Staff Only)
    def test_create_account_staff_only(self):
        self.client.force_authenticate(user=self.user) # Ordinary user tries
        response = self.client.post('/api/accounts/', {'account_number': 'DUB-NEXT', 'username': 'john', 'balance': 0, 'account_type': 'Savings', 'status': 'Active'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        self.client.force_authenticate(user=self.staff_user) # Staff tries
        response = self.client.post('/api/accounts/', {'account_number': 'DUB-NEXT', 'username': 'john', 'balance': 0, 'account_type': 'Savings', 'status': 'Active'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # 3. GET /api/accounts/{id}/ (Detail - Permission Check)
    def test_get_account_permission(self):
        other_user = User.objects.create_user(username='hacker', password='password123')
        self.client.force_authenticate(user=other_user)
        response = self.client.get(f'/api/accounts/{self.account.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 4. PUT /api/accounts/{id}/ (Update Nickname)
    def test_update_account_nickname(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.put(f'/api/accounts/{self.account.id}/', {
            'account_number': self.account.account_number,
            'account_type': self.account.account_type,
            'balance': self.account.balance,
            'status': self.account.status,
            'nickname': 'Vacation Fund'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.account.refresh_from_db()
        self.assertEqual(self.account.nickname, 'Vacation Fund')

    # 5. POST /api/transfers/ (Atomic Transfer)
    def test_fund_transfer(self):
        dest_account = Account.objects.create(user=self.staff_user, account_number='DUB-9999', balance=0, account_type='Savings', status='Active')
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/transfers/', {
            'from_account': self.account.id,
            'to_account_number': 'DUB-9999',
            'amount': 250.00
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.account.refresh_from_db()
        dest_account.refresh_from_db()
        self.assertEqual(float(self.account.balance), 750.00)
        self.assertEqual(float(dest_account.balance), 250.00)

    # 6. DELETE /api/accounts/{id}/ (Staff Only)
    def test_delete_account_staff_only(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f'/api/accounts/{self.account.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.delete(f'/api/accounts/{self.account.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # 7. GET /api/profile/ (Retrieve Profile)
    def test_get_profile(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'john')
