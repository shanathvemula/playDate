# Generated by Django 5.1.1 on 2024-10-03 08:25

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grounds', '0005_alter_grounds_created_alter_grounds_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='grounds',
            name='active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='grounds',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 3, 13, 55, 27, 924079)),
        ),
    ]