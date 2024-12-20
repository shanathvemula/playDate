# Generated by Django 5.1.1 on 2024-11-26 18:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment_id', models.CharField(max_length=100, verbose_name='Payment ID')),
                ('order_id', models.CharField(max_length=100, unique=True, verbose_name='Order ID')),
                ('signature', models.CharField(max_length=200, verbose_name='Signature')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Amount')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date Created')),
            ],
            options={
                'db_table': 'transactions',
            },
        ),
    ]
