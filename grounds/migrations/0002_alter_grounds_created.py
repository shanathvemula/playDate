# Generated by Django 5.1.1 on 2024-10-28 17:15

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grounds', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grounds',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 28, 22, 45, 32, 507021)),
        ),
    ]