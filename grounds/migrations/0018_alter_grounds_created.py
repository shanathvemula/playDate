# Generated by Django 5.1.1 on 2024-10-09 11:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grounds', '0017_alter_grounds_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grounds',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 9, 16, 44, 45, 320308)),
        ),
    ]
