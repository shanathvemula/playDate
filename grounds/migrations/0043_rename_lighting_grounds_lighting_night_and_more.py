# Generated by Django 5.1.1 on 2024-10-23 09:26

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grounds', '0042_alter_grounds_created'),
    ]

    operations = [
        migrations.RenameField(
            model_name='grounds',
            old_name='lighting',
            new_name='lighting_night',
        ),
        migrations.RenameField(
            model_name='grounds',
            old_name='locker_rooms',
            new_name='locker_room',
        ),
        migrations.RenameField(
            model_name='grounds',
            old_name='parking',
            new_name='parking_facility',
        ),
        migrations.RenameField(
            model_name='grounds',
            old_name='washrooms',
            new_name='wash_rooms',
        ),
        migrations.AlterField(
            model_name='grounds',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 23, 14, 56, 10, 808914)),
        ),
    ]