from django.urls import path

from tournament.views import TournamentCRUD # , TournamentList

urlpatterns = [
    # path('tournaments/', TournamentList.as_view()),
    path('tournament/', TournamentCRUD.as_view()),
]