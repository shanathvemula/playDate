# Generated by Django 5.1.1 on 2024-10-01 04:32

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grounds', '0002_grounds_address_grounds_name_alter_grounds_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grounds',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 1, 10, 2, 52, 274503)),
        ),
    ]
