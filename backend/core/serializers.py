from rest_framework import serializers
from .models import CryptoAsset, Portfolio, Transaction, Watchlist, UserProfile


class CryptoAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CryptoAsset
        fields = '__all__'


class PortfolioSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset_symbol = serializers.CharField(source='asset.symbol', read_only=True)
    current_price = serializers.DecimalField(source='asset.current_price', max_digits=20, decimal_places=8, read_only=True)
    total_value = serializers.FloatField(read_only=True)
    profit_loss = serializers.FloatField(read_only=True)
    profit_loss_percent = serializers.FloatField(read_only=True)

    class Meta:
        model = Portfolio
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset_symbol = serializers.CharField(source='asset.symbol', read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'


class WatchlistSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset_symbol = serializers.CharField(source='asset.symbol', read_only=True)
    current_price = serializers.DecimalField(source='asset.current_price', max_digits=20, decimal_places=8, read_only=True)
    change_24h = serializers.DecimalField(source='asset.change_24h', max_digits=10, decimal_places=4, read_only=True)

    class Meta:
        model = Watchlist
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'