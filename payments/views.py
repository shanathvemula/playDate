from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework import status

from rest_framework_simplejwt.tokens import AccessToken

from datetime import datetime

from grounds.views import GroundNew
from payments.serializers import (CreateOrderSerializer, VerifyOrderSerializer, TransactionSerializer, Transaction,
                                  TransactionSerializerPost)
from app.serializer import UserSerializer

import json

import os

from app.views import send_mail, BASE_DIR

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
                transaction_serializer = TransactionSerializerPost(data=order)
                if transaction_serializer.is_valid():
                    transaction_serializer.save()
                    return Response(order, status=status.HTTP_200_OK)
                return Response(transaction_serializer.errors, status=status.HTTP_200_OK)
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
            transaction_serializer = TransactionSerializerPost(data=data)
            if transaction_serializer.is_valid():
                k = client.utility.verify_payment_signature({"razorpay_order_id":data['order_id'],
                                                         "razorpay_payment_id":data['payment_id'],
                                                         "razorpay_signature":data['signature']})
                print(k)
                transaction_serializer.save()
                return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
            return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        try:
            data = request.data
            # print("Put data", data)
            payment_details = client.payment.fetch(data['payment_id'])
            # print("Payment details", payment_details)
            transaction = Transaction.objects.get(order_id=data['order_id'])
            # print("transaction", transaction.groundId.id)
            ground = GroundNew.objects.get(id=transaction.groundId.id)
            # print("Ground details", ground, transaction.user.isdigit())
            if transaction.user.isdigit():
                user = UserSerializer(User.objects.get(id=int(transaction.user))).data
            else:
                user = {"first_name": transaction.user, "last_name": " ", "phone": " ", "email": transaction.user}
            # print(user['email'])
            transaction_serializer = TransactionSerializerPost(transaction, data=data, partial=True)
            if transaction_serializer.is_valid():
                transaction_serializer.save()
                if data['status'] == 'SUCCESS':
                    with open(os.path.join(BASE_DIR / "templates" / "mail_templates" / "ticket.html"),
                              "r") as html:
                        body = html.read()
                        body = (body.replace("{{ first_name }}", user['first_name']).
                                replace("{{ last_name }}", user['last_name']).
                                replace("{{ amount }}", str(payment_details['amount'] /100)).
                                replace("{{ email }}", user['email']). replace("{{ phone }}", str(user['phone'])).
                                replace("{{ ground_name }}", ground.ground_name).
                                replace("{{ address }}", ground.address))
                    send_mail(to=user['email'], subject="PlayDate Ground Booking Confirmation", body=body)
                return Response(transaction_serializer.data, status=status.HTTP_200_OK)
            return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BookingInfo(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        try:
            order_id = request.GET.get('order_id')
            transaction = Transaction.objects.get(order_id=order_id)
            serializer = TransactionSerializer(transaction)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        try:
            access_token = AccessToken(request.headers['Authorization'].split(' ')[-1])
            print("access token", access_token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            print(user.first_name, user.user_type)
            if user.user_type == 'End User':
                trans = Transaction.objects.filter(user=str(user_id))
            elif user.user_type == 'Ground Manager':
                trans = Transaction.objects.filter(groundId__CreatedBy=str(user_id))
            serializer = TransactionSerializer(trans, many=True)
            print("Transactions", trans)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)