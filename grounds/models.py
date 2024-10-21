from enum import unique
from random import choices
from tokenize import blank_re

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

from datetime import datetime

# Create your models here.
ScoreboardType = (('Digital', 'Digital'), ('Manual', 'Manual'))
maintenanceStatus = (('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Pending', 'Pending'), ('Not Scheduled', 'Not Scheduled'))


class Grounds(models.Model):
    ground_name = models.CharField(max_length=500, unique=False)
    game = models.CharField(max_length=150)
    # ground_type = models.CharField(max_length=150)
    location = models.CharField(max_length=500, blank=True, null=True)
    capacity = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    surface_type = models.CharField(max_length=250)
    ground_images = models.JSONField(default=dict, blank=True, null=True)
    locker_rooms = models.BooleanField(default=False)
    washrooms = models.BooleanField(default=False)
    lighting = models.BooleanField(default=False)  # Floodlights availability for night matches
    parking = models.BooleanField(default=False)  # Parking Facility (Yes/No)
    scoreboard = models.BooleanField(default=False)  # Scoreboard available or not
    scoreboard_type = models.CharField(default=None, blank=True, null=True, choices=ScoreboardType, max_length=20)
    last_maintenance_date = models.DateTimeField(blank=True, null=True)
    next_maintenance_date = models.DateTimeField(blank=True, null=True)
    maintenance_status = models.CharField(max_length=20, choices=maintenanceStatus)
    # Arena = models.JSONField(default=dict, blank=True, null=True)
    address = models.JSONField(default=dict, blank=True, null=True)
    created = models.DateTimeField(default=datetime.now())
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    ground_images = models.JSONField(default=dict, blank=True, null=True)

    class Meta:
        db_table = 'grounds'

    # def __str__(self):
    #     return self.name
