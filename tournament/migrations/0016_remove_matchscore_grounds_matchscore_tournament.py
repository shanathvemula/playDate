# Generated by Django 5.0.4 on 2025-06-15 17:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0015_tournament_match_schedule_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='matchscore',
            name='grounds',
        ),
        migrations.AddField(
            model_name='matchscore',
            name='tournament',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tournament.tournament'),
        ),
    ]
