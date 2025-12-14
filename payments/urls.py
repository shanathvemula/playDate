from django.contrib import admin
from django.urls import path

from payments.views import RazorPayOrders, TransactionCRUD, BookingInfo, PhonepayOrders

urlpatterns = [
    path('RazorPay/', RazorPayOrders.as_view()),
    path('order/', TransactionCRUD.as_view()),
    path('booking/', BookingInfo.as_view()),
    path('orders/', PhonepayOrders.as_view()),
]