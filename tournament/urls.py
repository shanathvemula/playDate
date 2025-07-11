from django.urls import path

from tournament.views import (TournamentCRUD, TournamentsList, TeamsCRUD,
                              TournamentGroundDepthAPIView, CreateTeamAPIView
                              )

urlpatterns = [
    path('tournaments/', TournamentsList.as_view()),
    path('tournament/', TournamentCRUD.as_view()),
    path('teams/', TeamsCRUD.as_view()),
    path('tournament_ground/', TournamentGroundDepthAPIView.as_view()),
    path('create_team/', CreateTeamAPIView.as_view()),
]