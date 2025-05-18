from django.contrib import admin

# Register your models here.
from tournament.models import Tournament, Teams, MatchScore

admin.site.register(Tournament)
admin.site.register(Teams)
admin.site.register(MatchScore)