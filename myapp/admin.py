# Django admin module used to manage application data through the admin interface
from django.contrib import admin

# Importing models from this app so they can be registered in the admin panel
from .models import UserProfile, Account, Transfer, Transaction


# Registering models so they appear in the Django Admin dashboard.
# This allows administrators to view, add, edit, and delete records
# directly from the admin interface without needing custom views.
admin.site.register(UserProfile)
admin.site.register(Account)
admin.site.register(Transfer)
admin.site.register(Transaction)