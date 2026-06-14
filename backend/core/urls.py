from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'assets', views.CryptoAssetViewSet)
router.register(r'portfolio', views.PortfolioViewSet)
router.register(r'transactions', views.TransactionViewSet)
router.register(r'watchlist', views.WatchlistViewSet)
router.register(r'profile', views.UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]