from django.db import models


class CryptoAsset(models.Model):
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=20)
    current_price = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    market_cap = models.DecimalField(max_digits=30, decimal_places=2, default=0)
    volume_24h = models.DecimalField(max_digits=30, decimal_places=2, default=0)
    change_24h = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    logo_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-market_cap']

    def __str__(self):
        return f"{self.name} ({self.symbol})"


class Portfolio(models.Model):
    asset = models.ForeignKey(CryptoAsset, on_delete=models.CASCADE, related_name='portfolio_entries')
    quantity = models.DecimalField(max_digits=20, decimal_places=8)
    buy_price = models.DecimalField(max_digits=20, decimal_places=8)
    buy_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_value(self):
        return float(self.quantity) * float(self.asset.current_price)

    @property
    def profit_loss(self):
        invested = float(self.quantity) * float(self.buy_price)
        current = float(self.quantity) * float(self.asset.current_price)
        return current - invested

    @property
    def profit_loss_percent(self):
        invested = float(self.quantity) * float(self.buy_price)
        if invested == 0:
            return 0
        return ((float(self.asset.current_price) - float(self.buy_price)) / float(self.buy_price)) * 100

    def __str__(self):
        return f"{self.asset.symbol} - {self.quantity}"


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
        ('TRANSFER_IN', 'Transfer In'),
        ('TRANSFER_OUT', 'Transfer Out'),
    ]

    asset = models.ForeignKey(CryptoAsset, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.DecimalField(max_digits=20, decimal_places=8)
    price_per_unit = models.DecimalField(max_digits=20, decimal_places=8)
    total_amount = models.DecimalField(max_digits=30, decimal_places=2)
    fee = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    transaction_date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-transaction_date']

    def __str__(self):
        return f"{self.transaction_type} - {self.asset.symbol} - {self.quantity}"


class Watchlist(models.Model):
    asset = models.ForeignKey(CryptoAsset, on_delete=models.CASCADE, related_name='watchlist_entries')
    alert_price_high = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)
    alert_price_low = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Watching: {self.asset.symbol}"


class UserProfile(models.Model):
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('PKR', 'Pakistani Rupee'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
    ]

    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    preferred_currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username