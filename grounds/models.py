from django.db import models
from django.contrib.auth.models import User

from datetime import datetime

# Create your models here.
ScoreboardType = (('Digital', 'Digital'), ('Manual', 'Manual'))


class Grounds(models.Model):
    name = models.CharField(max_length=500, unique=True)
    address = models.JSONField(default=dict, blank=True, null=True)
    locker_rooms = models.BooleanField(default=False)
    washrooms = models.BooleanField(default=False)
    lighting = models.BooleanField(default=False)  # Floodlights availability for night matches
    parking = models.BooleanField(default=False)  # Parking Facility (Yes/No)
    scoreboard = models.BooleanField(default=False)  # Scoreboard available or not
    scoreboard_type = models.CharField(default=None, blank=True, null=True, choices=ScoreboardType, max_length=20)
    created = models.DateTimeField(default=datetime.now())
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'grounds'

    # def __str__(self):
    #     return self.name
