from django.urls import path

from tournament.views import TournamentCRUD, TournamentsList, TeamsCRUD

urlpatterns = [
    path('tournaments/', TournamentsList.as_view()),
    path('tournament/', TournamentCRUD.as_view()),
    path('teams/', TeamsCRUD.as_view())
]