from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import F, Func, Value
from django.db.models.functions import Cast
from django.db import models
from django.http import HttpResponse, JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework import status

from rest_framework_simplejwt.tokens import AccessToken

from datetime import datetime

from grounds.views import GroundNew
from payments.serializers import (CreateOrderSerializer, VerifyOrderSerializer, TransactionSerializer, Transaction,
                                  TransactionSerializerPost)
from tournament.models import Tournament
from app.serializer import UserSerializer

import json

import os

from app.views import send_mail, BASE_DIR

import razorpay

import qrcode
import base64
from io import BytesIO
import uuid
import requests

from playDate.settings import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


def gen_code(amount, order_id, url, upi_id):
    upi_link = f"upi://pay?pa={upi_id}&pn=Playdate%20Sport&mc=0000&mode=02&purpose=00&am={amount}&tn={order_id}&url={url}"
    qr = qrcode.make(upi_link)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.read()).decode("utf-8")
    return f"data:image/png;base64,{img_base64}", upi_link

# Create your views here.
class RazorPayOrders(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            tournamentId = data.pop('tournamentId', None)
            name = data.pop('name', None)
            email = data.pop('email', None)
            phone = data.pop('phone', None)
            price = Tournament.objects.get(id=tournamentId).price
            data['amount'] = float(price*100)
            print(price, data)
            user_info = data.pop('user')
            try:
                user_info = json.loads(user_info)['id']
            except:
                user_info = user_info
            selectedSlots = data.pop('selectedSlots', None)
            if selectedSlots:
                date = selectedSlots[0]['date']
            else:
                date = datetime.strftime(datetime.now(), "%Y-%m-%d %H:%M:%S")
            groundId = data.pop('groundId', None)
            teamId = data.pop('teamId', None)
            # print("groundId", groundId)
            create_order_serializer = CreateOrderSerializer(data=data)
            if create_order_serializer.is_valid():
                order = client.order.create(data)
                if tournamentId or teamId:
                    order['tournament'] = tournamentId
                    order['team'] = teamId
                else:
                    order['groundId'] = groundId
                    order['selectedSlots'] = selectedSlots
                order['order_id'] = order.pop('id')
                order['amount'] = order['amount'] / 100
                order['amount_due'] = order['amount_due'] / 100
                order['booked_date'] = datetime.fromisoformat(date)
                order['user'] = user_info
                # order['slotDates'] = order['selectedSlots'][0]['date']


                order.pop('created_at')
                transaction_serializer = TransactionSerializerPost(data=order)
                if transaction_serializer.is_valid():
                    transaction_serializer.save()
                    if tournamentId or teamId:
                        qr_code, upi_link = gen_code(amount=order['amount'], order_id=order['order_id'],
                                                     url=os.getenv("PAYMENT_QR_CODE_REDIRECT_URL"),
                                                     upi_id=os.getenv("PAYMENT_UPI_ID"))
                        print(upi_link)
                        with open(os.path.join(
                                BASE_DIR / "templates" / "mail_templates" / "tournament_registration_success.html"),
                                  "r") as html:
                            body = html.read()
                            body = (body.replace("{{ first_name }}", user_info.split('@')[0]).replace("{{ tournament }}",
                                                                                                 Tournament.objects.get(
                                                                                                     id=tournamentId).name).
                                    replace("{{ amount }}", str(order['amount'])).replace("{{ qr_code_url }}", qr_code)
                                    .replace("{{ upi_link }}", upi_link))
                            order['qr_code'] = qr_code
                            order['upi_link'] = upi_link
                            print(qr_code)
                        send_mail(to=user_info, subject="PlayDate Tournament Registration Confirmation", body=body)
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
            selectedSlots = data.pop("selectedSlots", None)
            # print("selectedSlots", selectedSlots)
            if selectedSlots:
                data['slotDates'] = data['selectedSlots'][0]['date']
            transaction_serializer = TransactionSerializerPost(data=data)
            if transaction_serializer.is_valid():
                k = client.utility.verify_payment_signature({"razorpay_order_id":data['order_id'],
                                                         "razorpay_payment_id":data['payment_id'],
                                                         "razorpay_signature":data['signature']})
                # print(k)
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
            if transaction.groundId:
                ground = GroundNew.objects.get(id=transaction.groundId.id)
            else:
                ground = None
            # print("Ground details", ground, transaction.user.isdigit())
            if transaction.user.isdigit():
                user = UserSerializer(User.objects.get(id=int(transaction.user))).data
            else:
                user = {"first_name": transaction.user, "last_name": " ", "phone": " ", "email": transaction.user}
            # print(user['email'])
            transaction_serializer = TransactionSerializerPost(transaction, data=data, partial=True)
            if transaction_serializer.is_valid():
                transaction_serializer.save()
                if data['status'] == 'SUCCESS' and ground:
                    with open(os.path.join(BASE_DIR / "templates" / "mail_templates" / "ticket.html"),
                              "r") as html:
                        body = html.read()
                        body = (body.replace("{{ first_name }}", user['first_name']).
                                replace("{{ last_name }}", user['last_name']).
                                replace("{{ amount }}", str(payment_details['amount'] /100)).
                                replace("{{ email }}", user['email']). replace("{{ phone }}", str(user['phone'])))
                        if ground:
                            body=(body.replace("{{ ground_name }}", ground.ground_name).
                                replace("{{ address }}", ground.address))
                    send_mail(to=user['email'], subject="PlayDate Ground Booking Confirmation", body=body)
                if data['status'] == 'SUCCESS' and transaction.tournament:
                    with open(os.path.join(BASE_DIR / "templates" / "mail_templates" / "tournament_registration_success.html"),"r") as html:
                        body = html.read()
                        body = (body.replace("{{ first_name }}", user['first_name']).replace("{{ tournament }}", transaction.tournament.name))
                    send_mail(to=user['email'], subject="PlayDate Tournament Registration Confirmation", body=body)
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
            # print("access token", access_token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            # print(user.first_name, user.user_type)
            if user.user_type == 'End User':
                trans = Transaction.objects.filter(user=str(user_id))
            elif user.user_type == 'Ground Manager':
                trans = Transaction.objects.filter(groundId__CreatedBy=str(user_id))
            serializer = TransactionSerializer(trans, many=True)
            # print("Transactions", trans)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PhonepayOrders(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            # print(data)
            client_id = os.getenv('PHONEPAY_CLIENT_ID')
            client_version = os.getenv('PHONEPAY_CLIENT_VERSION')
            client_secret = os.getenv('PHONEPAY_CLIENT_SECRET')
            token_url = url = "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token"
            token_payload = f'client_id={client_id}&client_version={client_version}&client_secret={client_secret}&grant_type=client_credentials'
            token_headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            response = requests.request("POST", token_url, data=token_payload, headers=token_headers)
            print(response.json()), client_id, client_secret
            url = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay"
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'O-Bearer {response.json()['access_token']}'
            }
            amount = data.get("amount", None)
            print("amount", amount)
            if amount in [None, ""]:
                amount = Tournament.objects.get(id=data['tournamentId']).price
            amount = int(float(amount))
            print("amount",amount)
            # amount = data['amount']
            print(amount, type(amount))
            order = {
                "merchantOrderId":f"Order_{uuid.uuid4().hex[:10]}",
                "amount": 100, # amount * 100,
                "expireAfter": 1200,
                "metaInfo": data,
                "paymentFlow": {
                    "type": "PG_CHECKOUT",
                    "message": "Payment message used for collect requests",
                    "merchantUrls": {
                        "redirectUrl": "https://playdatesport.com/"
                    }
                }
            }
            print(order)
            order_response = requests.request("POST", url, headers=headers, json=order)
            print(order_response.json())
            return JsonResponse(order_response.json(), content_type='application/json', status=order_response.status_code)
        except Exception as e:
            raise e
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)