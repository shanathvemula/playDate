# Generated by Django 5.1.1 on 2024-12-08 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0006_remove_transaction_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='user',
            field=models.CharField(default='', max_length=250),
            preserve_default=False,
        ),
    ]