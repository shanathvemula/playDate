from django.urls import re_path
from app.consumers import UserConsumer, SiteManagementsConsumer

app_websocket_urlpatterns = [
    re_path(r"^users$", UserConsumer.as_asgi()),
    re_path(r"^sites$", SiteManagementsConsumer.as_asgi()),
]
