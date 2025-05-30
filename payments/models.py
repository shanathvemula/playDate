from django.db import models

from grounds.models import GroundNew
from tournament.models import Tournament, Teams

def GenTransactionIds():
    trans = Transaction.objects.all().order_by('id').last()
    if not trans:
        return "TNS" + '0000001'
    return 'TNS' + str(int(trans.id[4:]) + 1).zfill(7)

# Create your models here.
class Transaction(models.Model):
    id = models.CharField(max_length=15, primary_key=True, default=GenTransactionIds)
    payment_id = models.CharField(max_length=100, verbose_name="Payment ID", blank=True, null=True)
    order_id = models.CharField(max_length=100, unique=True, verbose_name="Order ID")
    signature = models.CharField(max_length=200, verbose_name="Signature", blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Amount")
    date_created = models.DateTimeField(auto_now_add=True, verbose_name="Date Created")
    groundId = models.ForeignKey(GroundNew, on_delete=models.CASCADE, verbose_name="Ground ID",
                                 blank=True, null=True, default=None) # models.CharField(max_length=150, blank=True, null=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, verbose_name="Tournament", blank=True, null=True, default=None)
    team = models.ForeignKey(Teams, on_delete=models.CASCADE, verbose_name="Tournament", blank=True, null=True, default=None)
    selectedSlots = models.JSONField(default=dict, blank=True, null=True)
    # slotDates = models.DateTimeField(auto_now_add=True, verbose_name="Slot selected Date")
    amount_due = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Amount Due", blank=True, null=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Amount Paid", blank=True, null=True)
    attempts = models.IntegerField(default=0, verbose_name="Attempts")
    currency = models.CharField(max_length=10, verbose_name="Currency")
    order_id = models.CharField(max_length=200, verbose_name="Order ID")
    status = models.CharField(max_length=20, verbose_name="Status")
    booked_date = models.DateTimeField(blank=True, null=True)
    user = models.CharField(max_length=250)
    message = models.CharField(max_length=250, blank=True, null=True)

    def __str__(self):
        return str(self.order_id)

    class Meta:
        db_table = "transactions"