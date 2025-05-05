from django.urls import path

from tournament.views import TournamentCRUD, TournamentsList

urlpatterns = [
    path('tournaments/', TournamentsList.as_view()),
    path('tournament/', TournamentCRUD.as_view()),
]