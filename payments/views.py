from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework import status

from datetime import datetime

from payments.serializers import CreateOrderSerializer, VerifyOrderSerializer, TransactionSerializer, Transaction

import json

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
            data['amount'] = float(data['amount']*100)
            user_info = data.pop('user')
            try:
                user_info = json.loads(user_info)['id']
            except:
                user_info = user_info
            selectedSlots = data.pop('selectedSlots')
            date = selectedSlots[0]['date']
            groundId = data.pop('groundId')
            create_order_serializer = CreateOrderSerializer(data=data)
            if create_order_serializer.is_valid():
                order = client.order.create(data)
                order['groundId'] = groundId
                order['selectedSlots'] = selectedSlots
                order['order_id'] = order.pop('id')
                order['amount'] = order['amount'] / 100
                order['amount_due'] = order['amount_due'] / 100
                order['ground_booked_date'] = datetime.fromisoformat(date)
                order['user'] = user_info


                order.pop('created_at')
                print('created order', order, date)
                transaction_serializer = TransactionSerializer(data=order)
                if transaction_serializer.is_valid():
                    transaction_serializer.save()
                    return Response(order, status=status.HTTP_200_OK)
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

    def put(self, request, *args, **kwargs):
        try:
            data = request.data
            print("Put data", data)
            payment_details = client.payment.fetch(data['paymentId'])
            # print("Payment details", payment_details)
            transaction = Transaction.objects.get(order_id=data['order_id'])
            transaction_serializer = TransactionSerializer(transaction, data=data, partial=True)
            if transaction_serializer.is_valid():
                transaction_serializer.save()
                return Response(transaction_serializer.data, status=status.HTTP_200_OK)
            return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)