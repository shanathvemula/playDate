# Generated by Django 5.1.1 on 2024-12-10 16:31

import payments.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0007_transaction_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='id',
            field=models.CharField(default=payments.models.GenTransactionIds, max_length=15, primary_key=True, serialize=False),
        ),
    ]
