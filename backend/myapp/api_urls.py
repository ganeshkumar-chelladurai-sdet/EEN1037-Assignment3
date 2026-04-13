from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.permissions import AllowAny

from . import api_views

app_name = 'api'
urlpatterns = [
    # Account endpoints — list accounts or get/delete a specific one
    path('accounts/', api_views.AccountListView.as_view(), name='account-list'),
    path('accounts/<int:account_id>/', api_views.AccountDetailView.as_view(), name='account-detail'),

    # Transfer endpoint — list past transfers or submit a new transfer
    path('transfers/', api_views.TransferListView.as_view(), name='transfer-list'),

    # Transaction history endpoint — list all transactions for the user's accounts
    path('transactions/', api_views.TransactionListView.as_view(), name='transaction-list'),

    # Profile endpoint — view or update the authenticated user's profile
    path('profile/', api_views.ProfileView.as_view(), name='profile'),
    path('profile/photo/', api_views.ProfilePhotoView.as_view(), name='profile-photo'),

    # Authentication endpoints provided by dj-rest-auth (login, logout, user)
    path('auth/', include('dj_rest_auth.urls')),

    # Custom registration endpoint
    path('auth/register/', api_views.RegisterView.as_view(), name='register'),

    # OpenAPI schema and Swagger UI for API documentation
    path('schema/', SpectacularAPIView.as_view(permission_classes=[AllowAny]), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='api:schema', permission_classes=[AllowAny]), name='docs'),
]
