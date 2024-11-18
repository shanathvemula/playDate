from django.urls import re_path
from grounds.consumers import GroundConsumer, GroundManagementConsumer, GroundNewConsumer

ground_websocket_urlpatterns = [
    re_path(r"^grounds", GroundConsumer.as_asgi()),
    re_path(r"^groundnew", GroundNewConsumer.as_asgi()),
    re_path(r"^ground", GroundManagementConsumer.as_asgi()),

]