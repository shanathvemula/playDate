from django.contrib import admin
from django.urls import path

from payments.views import RazorPayOrders, TransactionCRUD

urlpatterns = [
    path('orders/', RazorPayOrders.as_view()),
    path('complete_order/', TransactionCRUD.as_view()),
]