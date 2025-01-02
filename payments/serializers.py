from django.contrib.auth.models import User, Group, Permission, ContentType
from django.conf import settings
from django.core.serializers import serialize

from payments.models import Transaction

import os

from rest_framework.serializers import ModelSerializer, SerializerMethodField, Serializer
from rest_framework import serializers

from grounds.serializers import GroundNewSerializerSpecific

class CreateOrderSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(max_length=10)

class VerifyOrderSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField(max_length=200)
    razorpay_payment_id = serializers.CharField(max_length=200)
    razorpay_signature = serializers.CharField(max_length=200)

class TransactionSerializerPost(ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class TransactionSerializer(ModelSerializer):
    groundId = GroundNewSerializerSpecific()

    class Meta:
        model = Transaction
        fields = '__all__'