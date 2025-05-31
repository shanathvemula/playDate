from django.urls import re_path
from app.consumers import UserConsumer, SiteManagementConsumer

app_websocket_urlpatterns = [
    re_path(r"ws/users$", UserConsumer.as_asgi()),
    re_path(r"ws/sites$", SiteManagementConsumer.as_asgi()),
]
