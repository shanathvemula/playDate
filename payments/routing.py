from django.urls import re_path
from payments.consumers import TransactionConsumer

payments_websocket_urlpatterns = [
    re_path(r"ws/transactions", TransactionConsumer.as_asgi())
]