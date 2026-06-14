from django.contrib import admin
from .models import CryptoAsset, Portfolio, Transaction, Watchlist, UserProfile


@admin.register(CryptoAsset)
class CryptoAssetAdmin(admin.ModelAdmin):
    list_display = ['name', 'symbol', 'current_price', 'change_24h', 'market_cap', 'updated_at']
    search_fields = ['name', 'symbol']
    list_filter = ['created_at']


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ['asset', 'quantity', 'buy_price', 'buy_date']
    search_fields = ['asset__name', 'asset__symbol']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['asset', 'transaction_type', 'quantity', 'price_per_unit', 'total_amount', 'transaction_date']
    list_filter = ['transaction_type', 'transaction_date']
    search_fields = ['asset__name', 'asset__symbol']


@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    list_display = ['asset', 'alert_price_high', 'alert_price_low', 'created_at']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'full_name', 'preferred_currency', 'created_at']
    search_fields = ['username', 'email', 'full_name']