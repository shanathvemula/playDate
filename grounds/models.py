from random import choices
from tokenize import blank_re

from django.db import models
from django.contrib.auth.models import User

from datetime import datetime

# Create your models here.
ScoreboardType = (('Digital', 'Digital'), ('Manual', 'Manual'))
maintenanceStatus = (('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Pending', 'Pending'), ('Not Scheduled', 'Not Scheduled'))


class Grounds(models.Model):
    name = models.CharField(max_length=500, unique=True)
    location = models.CharField(max_length=500, blank=True, null=True)
    Arena = models.JSONField(default=dict, blank=True, null=True)
    address = models.JSONField(default=dict, blank=True, null=True)
    locker_rooms = models.BooleanField(default=False)
    washrooms = models.BooleanField(default=False)
    lighting = models.BooleanField(default=False)  # Floodlights availability for night matches
    parking = models.BooleanField(default=False)  # Parking Facility (Yes/No)
    scoreboard = models.BooleanField(default=False)  # Scoreboard available or not
    scoreboard_type = models.CharField(default=None, blank=True, null=True, choices=ScoreboardType, max_length=20)
    last_maintenance_date = models.DateTimeField(blank=True, null=True)
    next_maintenance_date = models.DateTimeField(blank=True, null=True)
    maintenance_status = models.CharField(max_length=20, choices=maintenanceStatus)
    created = models.DateTimeField(default=datetime.now())
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    ground_images = models.JSONField(default=dict, blank=True, null=True)

    class Meta:
        db_table = 'grounds'

    # def __str__(self):
    #     return self.name
