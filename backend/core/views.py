from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count
from decimal import Decimal
from .models import CryptoAsset, Portfolio, Transaction, Watchlist, UserProfile
from .serializers import (
    CryptoAssetSerializer, PortfolioSerializer,
    TransactionSerializer, WatchlistSerializer, UserProfileSerializer
)


class CryptoAssetViewSet(viewsets.ModelViewSet):
    queryset = CryptoAsset.objects.all()
    serializer_class = CryptoAssetSerializer


class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.select_related('asset').all()
    serializer_class = PortfolioSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.select_related('asset').all()
    serializer_class = TransactionSerializer


class WatchlistViewSet(viewsets.ModelViewSet):
    queryset = Watchlist.objects.select_related('asset').all()
    serializer_class = WatchlistSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


@api_view(['GET'])
def dashboard_stats(request):
    """Dashboard ke liye summary stats"""
    portfolios = Portfolio.objects.select_related('asset').all()

    total_invested = sum(
        float(p.quantity) * float(p.buy_price) for p in portfolios
    )
    total_current_value = sum(p.total_value for p in portfolios)
    total_profit_loss = total_current_value - total_invested
    total_pnl_percent = ((total_profit_loss / total_invested) * 100) if total_invested > 0 else 0

    total_transactions = Transaction.objects.count()
    watchlist_count = Watchlist.objects.count()
    assets_count = CryptoAsset.objects.count()

    recent_transactions = Transaction.objects.select_related('asset').order_by('-transaction_date')[:5]
    recent_tx_data = TransactionSerializer(recent_transactions, many=True).data

    top_assets = CryptoAsset.objects.order_by('-market_cap')[:5]
    top_assets_data = CryptoAssetSerializer(top_assets, many=True).data

    return Response({
        'total_portfolio_value': round(total_current_value, 2),
        'total_invested': round(total_invested, 2),
        'total_profit_loss': round(total_profit_loss, 2),
        'total_pnl_percent': round(total_pnl_percent, 2),
        'total_transactions': total_transactions,
        'watchlist_count': watchlist_count,
        'assets_count': assets_count,
        'recent_transactions': recent_tx_data,
        'top_assets': top_assets_data,
    })