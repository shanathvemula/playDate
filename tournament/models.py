from datetime import  date

from django.db import models
from django.contrib.auth.models import User
from grounds.models import GroundNew

from django.utils import timezone

status_choice = (('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Pending', 'Pending'),
                 ('Not Scheduled', 'Not Scheduled'))
# Create your models here.
class Tournament(models.Model):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    about = models.TextField()
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    # start_time = models.TimeField(blank=True, null=True)
    # end_time = models.TimeField(blank=True, null=True)
    rules = models.JSONField(default=list, blank=True, null=True)
    images = models.JSONField(default=dict, blank=True, null=True)
    address = models.CharField(max_length=500, blank=True, null=True)
    ground = models.ManyToManyField(GroundNew)
    status = models.CharField(max_length=25, choices=status_choice)
    Created = models.DateTimeField(default=timezone.now)
    CreatedBy = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'tournament'