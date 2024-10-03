from django.urls import re_path
from grounds.consumers import GroundConsumer

ground_websocket_urlpatterns = [
    re_path(r"^grounds", GroundConsumer.as_asgi())
]