# Generated by Django 5.1.1 on 2024-12-08 22:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0005_transaction_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='user',
        ),
    ]