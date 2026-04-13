# Import Django's base model class
from django.db import models

# Import Django's built-in User model for authentication
from django.contrib.auth.models import User


# Model used to store additional information about a user
# that is not included in Django's default User model.
class UserProfile(models.Model):

    # One-to-one relationship ensures each user has exactly one profile
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Additional contact information for the user
    phone = models.CharField(max_length=20)

    # Address stored as text since it may contain multiple lines
    address = models.TextField()

    # User's date of birth
    date_of_birth = models.DateField()

    # Profile picture field (optional)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

    # String representation used in admin panel and debugging
    def __str__(self):
        return self.user.username


# Model representing a bank account belonging to a user
class Account(models.Model):

    # Each account belongs to one user
    # If the user is deleted, their accounts are also deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Unique bank account number
    account_number = models.CharField(max_length=20)

    # Type of account (e.g., Savings, Current)
    account_type = models.CharField(max_length=50)

    # Current balance stored as decimal for currency precision
    balance = models.DecimalField(max_digits=10, decimal_places=2)

    # Optional nickname for the account (e.g., "Main Savings")
    nickname = models.CharField(max_length=100, blank=True)

    # Account status (e.g., Active, Closed)
    status = models.CharField(max_length=20)

    # Display account number in admin and debug views
    def __str__(self):
        return self.account_number
    

# Model representing a transfer between two accounts
class Transfer(models.Model):

    # Source account for the transfer
    from_account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name="sent_transfers"
    )

    # Destination account receiving the transfer
    to_account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name="received_tranfers"
    )

    # Amount transferred
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Optional notes or remarks for the transfer
    notes = models.TextField(blank=True)

    # Timestamp automatically set when the transfer is created
    created_at = models.DateTimeField(auto_now_add=True)

    # Display transfer summary
    def __str__(self):
        return f"Transfer {self.amount}"
    

# Model storing transaction history for accounts
class Transaction(models.Model):

    # The account associated with this transaction
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    # Type of transaction (deposit, withdrawal, transfer, etc.)
    transaction_type = models.CharField(max_length=50)

    # Amount involved in the transaction
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Status of the transaction (Completed, Pending, Failed)
    status = models.CharField(max_length=20)

    # Automatically stores the timestamp when transaction is created
    created_at = models.DateTimeField(auto_now_add=True)

    # Display transaction summary
    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"
