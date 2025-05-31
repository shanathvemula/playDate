from django.urls import re_path
from tournament.consumers import TournamentConsumer

tournament_websocket_urlpatterns = [
    re_path(r"ws/tournaments", TournamentConsumer.as_asgi()),
]