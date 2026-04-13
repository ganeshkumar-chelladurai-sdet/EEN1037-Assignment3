# Import render for displaying templates and redirect for page navigation
from django.shortcuts import render, redirect

# Import Django's built-in user model
from django.contrib.auth.models import User

# Import application models
from .models import Account, Transaction, Transfer, UserProfile

# Used to ensure database operations complete successfully
from django.db import transaction

# Django authentication functions
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout

# Decorator used to restrict access to logged-in users only
from django.contrib.auth.decorators import login_required

# Decimal used for accurate financial calculations
from decimal import Decimal


# Homepage view
# Simply renders the landing page template
def index(request):
    return render(request, "myapp/index.html")


# User login view
def login_user(request):

    # If form is submitted
    if request.method == "POST":

        email = request.POST["email"]
        password = request.POST["password"]

        # Attempt to find user by email
        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return render(request, "myapp/login.html", {"error": "Invalid email"})

        # Authenticate using username and password
        user = authenticate(request, username=user.username, password=password)

        if user is not None:

            # Log the user into the session
            login(request, user)

            return redirect("index")

        else:
            return render(request, "myapp/login.html", {"error": "Invalid password"})

    return render(request, "myapp/login.html")


# Dashboard page (login required)
@login_required
def dashboard(request):

    return render(request, "myapp/dashboard.html")


# Display all accounts belonging to the logged-in user
@login_required
def accounts(request):

    accounts = Account.objects.filter(user=request.user)

    return render(request, "myapp/accounts.html", {"accounts": accounts})


# User registration view
def register_user(request):

    if request.method == "POST":

        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]

        # Basic validation
        if not username or not email:
            return render(request, "myapp/register.html", {"error": "All fields required"})

        # Create a new Django user
        user = User.objects.create_user(username=username, email=email, password=password)

        # Create associated user profile
        UserProfile.objects.create(
            user=user,
            phone="",
            address="",
            date_of_birth="2000-01-01"
        )

        return redirect("dashboard")

    return render(request, "myapp/register.html")


# Profile management view
@login_required
def update_profile(request):

    # Retrieve or create user profile if it does not exist
    profile, created = UserProfile.objects.get_or_create(user=request.user)

    if request.method == "POST":

        # Update profile fields
        profile.phone = request.POST["phone"]
        profile.address = request.POST["address"]

        profile.save()

        return redirect("profile")

    return render(request, "myapp/profile.html", {"profile": profile})


# Admin-only function to delete accounts
@login_required
def delete_account(request, id):

    # Prevent non-admin users from deleting accounts
    if not request.user.is_staff:
        return redirect("accounts")

    account = Account.objects.get(id=id)

    if request.method == "POST":
        account.delete()

    return redirect("accounts")


# Transfer money between accounts
# transaction.atomic ensures all operations succeed or fail together
@transaction.atomic
@login_required
def transfer_money(request):

    if request.method == "POST":

        from_id = request.POST["from_account"]
        to_id = request.POST["to_account"]

        amount = Decimal(request.POST["amount"])

        from_account = Account.objects.get(id=from_id)
        to_account = Account.objects.get(id=to_id)

        # Prevent transferring to the same account
        if from_account == to_account:
            return render(request, "myapp/transfer.html", {"error": "Cannot transfer to the same account"})

        # Prevent invalid transfer values
        if amount <= 0:
            return render(request, "myapp/transfer.html", {"error": "Invalid amount"})

        # Check available balance
        if from_account.balance < amount:
            return render(request, "myapp/transfer.html", {"error": "Insufficient balance"})

        # Perform balance updates
        from_account.balance -= amount
        to_account.balance += amount

        from_account.save()
        to_account.save()

        # Record transaction history
        Transaction.objects.create(
            account=from_account,
            transaction_type="Transfer",
            amount=amount,
            status="Completed"
        )

        return redirect("accounts")

    accounts = Account.objects.filter(user=request.user)

    return render(request, "myapp/transfer.html", {"accounts": accounts})


# Display transaction history for the logged-in user
@login_required
def transaction_history(request):

    transactions = Transaction.objects.filter(account__user=request.user)

    return render(request, "myapp/transaction-history.html", {"transactions": transactions})


# Logout view
# Ends the user session and redirects to login page
def logout_user(request):

    logout(request)

    return redirect("login")