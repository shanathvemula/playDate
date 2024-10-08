# Generated by Django 5.1.1 on 2024-10-01 04:32

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grounds', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='grounds',
            name='address',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
        migrations.AddField(
            model_name='grounds',
            name='name',
            field=models.CharField(default='', max_length=500),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='grounds',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 1, 10, 2, 33, 799302)),
        ),
    ]
