# Generated by Django 5.1.1 on 2024-10-17 04:04

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grounds', '0023_alter_grounds_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grounds',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 17, 9, 34, 36, 293147)),
        ),
    ]