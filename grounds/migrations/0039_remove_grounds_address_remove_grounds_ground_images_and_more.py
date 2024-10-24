# Generated by Django 5.1.1 on 2024-10-23 06:55

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grounds', '0038_alter_grounds_created_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='grounds',
            name='address',
        ),
        migrations.RemoveField(
            model_name='grounds',
            name='ground_images',
        ),
        migrations.RemoveField(
            model_name='grounds',
            name='lighting',
        ),
        migrations.RemoveField(
            model_name='grounds',
            name='locker_rooms',
        ),
        migrations.RemoveField(
            model_name='grounds',
            name='parking',
        ),
        migrations.RemoveField(
            model_name='grounds',
            name='scoreboard',
        ),
        migrations.RemoveField(
            model_name='grounds',
            name='washrooms',
        ),
        migrations.AddField(
            model_name='grounds',
            name='availability_status',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='grounds',
            name='lighting_night',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='grounds',
            name='locker_room',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='grounds',
            name='parking_facility',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='grounds',
            name='wash_rooms',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='grounds',
            name='capacity',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grounds',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 23, 12, 25, 2, 457206)),
        ),
        migrations.AlterField(
            model_name='grounds',
            name='last_maintenance_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='grounds',
            name='maintenance_status',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='grounds',
            name='next_maintenance_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='grounds',
            name='scoreboard_type',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterModelTable(
            name='grounds',
            table=None,
        ),
    ]
