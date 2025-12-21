from datetime import  date

from django.db import models
from django.contrib.auth.models import User
from grounds.models import GroundNew

from django.utils import timezone

def GenTeamId():
    ground = Teams.objects.all().order_by('id').last()
    if not ground:
        return "TEM" + '0000001'
    return 'TEM' + str(int(ground.id[4:]) + 1).zfill(7)

class Teams(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default=GenTeamId)
    name = models.CharField(max_length=250)
    images = models.JSONField(default=dict, blank=True, null=True)
    logo = models.FileField(upload_to='team_logo/', blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')
    team = models.JSONField(default=dict, blank=True, null=True)

    class Meta:
        db_table = 'teams'

status_choice = (('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Pending', 'Pending'),
                 ('Not Scheduled', 'Not Scheduled'))

def GenTournamentId():
    ground = Tournament.objects.all().order_by('id').last()
    if not ground:
        return "TUR" + '0000001'
    return 'TUR' + str(int(ground.id[4:]) + 1).zfill(7)

# Create your models here.
class Tournament(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default=GenTournamentId)
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    about = models.TextField()
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    game = models.CharField(max_length=250, blank=True, null=True, default=None)
    # start_time = models.TimeField(blank=True, null=True)
    # end_time = models.TimeField(blank=True, null=True)
    rules = models.JSONField(default=list, blank=True, null=True)
    images = models.JSONField(default=dict, blank=True, null=True)
    address = models.CharField(max_length=500, blank=True, null=True)
    ground = models.ManyToManyField(GroundNew)
    status = models.CharField(max_length=25, choices=status_choice)
    created_date = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_by')
    updated_date = models.DateTimeField(default=timezone.now, blank=True, null=True)
    updated_by = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE, related_name='updated_by')
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    teams = models.ManyToManyField(Teams, blank=True)
    match_schedule_image = models.JSONField(default=dict, blank=True, null=True)
    capacity = models.IntegerField(default=0)
    registered_count = models.IntegerField(default=0)
    price_pool = models.IntegerField(default=0) # Winner Price

    class Meta:
        db_table = 'tournament'


class MatchScore(models.Model):
    grounds = models.ForeignKey(GroundNew, models.CASCADE, blank=True, null=True)
    tournament = models.ForeignKey(Tournament, models.CASCADE, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    team1 = models.ForeignKey(Teams, on_delete=models.CASCADE, related_name='team1', blank=True, null=True)
    team2 = models.ForeignKey(Teams, on_delete=models.CASCADE, related_name='team2', blank=True, null=True)
    # teams = models.ManyToManyField(Teams, blank=True)
    score = models.JSONField(default=dict, blank=True, null=True)
    mvp = models.JSONField(default=dict, blank=True, null=True)

    class Meta:
        db_table = "match_score"

class Matches(models.Model):
    tournament = models.ForeignKey(Tournament, models.CASCADE, blank=True, null=True)
    team1 = models.ForeignKey(Teams, on_delete=models.CASCADE, related_name='match_team1', blank=True, null=True)
    team2 = models.ForeignKey(Teams, on_delete=models.CASCADE, related_name='match_team2', blank=True, null=True)
    winner = models.ForeignKey(Teams, on_delete=models.CASCADE, related_name='winner', blank=True, null=True)
    status = models.CharField(max_length=25, choices=status_choice)
    stage = models.CharField(max_length=250, blank=True, null=True)
    venue = models.CharField(max_length=250, blank=True, null=True)

    class Meta:
        db_table = 'matches'