from django.contrib.auth.models import User, Group, Permission, ContentType
from django.conf import settings

import os

from rest_framework.serializers import ModelSerializer, SerializerMethodField, Serializer


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class PermissionsSerializer(ModelSerializer):
    app_label = SerializerMethodField()

    def get_app_label(self, obj) -> str:
        return obj.content_type.model

    class Meta:
        model = Permission
        fields = ('name', 'codename', 'app_label')


class PermissionSerializer(ModelSerializer):
    class Meta:
        model = Permission
        fields = ('name',)


class UserSerializerDepth(ModelSerializer):
    user_permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = '__all__'


class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class PermissionSerializer(ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'name', 'codename')


class ContentTypeSerializer(ModelSerializer):
    class Meta:
        model = ContentType
        fields = '__all__'
