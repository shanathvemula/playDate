from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework import status

from payments.serializers import CreateOrderSerializer, VerifyOrderSerializer, TransactionSerializer, Transaction

import razorpay
from playDate.settings import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Create your views here.
class RazorPayOrders(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            create_order_serializer = CreateOrderSerializer(data=data)
            if create_order_serializer.is_valid():
                order = client.order.create(data)
                return Response(order, status=status.HTTP_200_OK)
            else:
                return Response(create_order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RazorPayPayment(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        data = request.data
        verify_order_serializer = VerifyOrderSerializer(data=data)
        if verify_order_serializer.is_valid():
            info = client.utility.verify_payment_signature(data)
            return Response(info, status=status.HTTP_200_OK)
        else:
            return Response(create_order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionCRUD(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            transaction_serializer = TransactionSerializer(data=data)
            if transaction_serializer.is_valid():
                client.utility.verify_payment_signature({"razorpay_order_id":data['order_id'],
                                                         "razorpay_payment_id":data['payment_id'],
                                                         "razorpay_signature":data['signature']})
                transaction_serializer.save()
                return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
            return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)