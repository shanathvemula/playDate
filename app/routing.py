from django.urls import re_path
from app.consumers import UserConsumer

app_websocket_urlpatterns = [
    re_path(r"^users$", UserConsumer.as_asgi())
]
