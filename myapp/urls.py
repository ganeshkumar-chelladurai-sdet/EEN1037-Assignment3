# Import Django path function used to define URL routes
from django.urls import path

# Import views from the current application
from . import views


# URL patterns define how different URLs map to view functions
urlpatterns = [

    # Homepage route
    path('', views.index, name='index'),

    # Dashboard page (main user landing page after login)
    path("dashboard/", views.dashboard, name="dashboard"),

    # User login page
    path("login/", views.login_user, name="login"),

    # User registration page
    path("register/", views.register_user, name="register"),

    # Page displaying all user bank accounts
    path("accounts/", views.accounts, name="accounts"),

    # Transfer funds between accounts
    path("transfer/", views.transfer_money, name="transfer"),

    # Page displaying transaction history
    path("transaction-history/", views.transaction_history, name="transaction_history"),

    # User profile management page
    path("profile/", views.update_profile, name="profile"),

    # Admin-only action to delete an account
    path("delete-account/<int:id>/", views.delete_account, name="delete_account"),

    # Logout route that ends the user session
    path("logout/", views.logout_user, name="logout")
]