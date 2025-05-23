# Generated by Django 5.1.1 on 2025-05-09 10:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grounds', '0012_alter_groundnew_unique_together_and_more'),
        ('tournament', '0012_tournament_teams'),
    ]

    operations = [
        migrations.CreateModel(
            name='MatchScore',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('start_time', models.TimeField(blank=True, null=True)),
                ('end_time', models.TimeField(blank=True, null=True)),
                ('score', models.JSONField(blank=True, default=dict, null=True)),
                ('mvp', models.JSONField(blank=True, default=dict, null=True)),
                ('grounds', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='grounds.groundnew')),
                ('teams', models.ManyToManyField(blank=True, null=True, to='tournament.teams')),
            ],
            options={
                'db_table': 'match_score',
            },
        ),
    ]
