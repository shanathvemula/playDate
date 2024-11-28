from django.db import models

# Create your models here.
class Transaction(models.Model):
    payment_id = models.CharField(max_length=100, verbose_name="Payment ID")
    order_id = models.CharField(max_length=100, unique=True, verbose_name="Order ID")
    signature = models.CharField(max_length=200, verbose_name="Signature")
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Amount")
    date_created = models.DateTimeField(auto_now_add=True, verbose_name="Date Created")

    def __str__(self):
        return str(self.id)

    class Meta:
        db_table = "transactions"