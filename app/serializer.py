from django.contrib.auth.models import User, Group, Permission, ContentType
from django.conf import settings
from django.core.serializers import serialize

from app.models import SiteManagement

import os

from rest_framework.serializers import ModelSerializer, SerializerMethodField, Serializer
from rest_framework import serializers

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

class UserSignUpSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username','password' ,'first_name')

class UserForgetPasswordSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')

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

class SiteManagementsSerializer(ModelSerializer):
    class Meta:
        model = SiteManagement
        fields = '__all__'


class SiteManagementSerializer(ModelSerializer):
    class Meta:
        model = SiteManagement
        fields = ['id', 'copyright', 'logo', 'slideshow', 'created_date']

    def create(self, validated_data):
        slideshow_data = validated_data.pop('slideshow', [])
        site_management = SiteManagement.objects.create(**validated_data)
        for slide in slideshow_data:
            site_management.slideshow.append(slide)
        site_management.save()
        return site_management

    def update(self, instance, validated_data):
        slideshow_data = validated_data.pop('slideshow', [])
        instance.copyright = validated_data.get('copyright', instance.copyright)
        instance.logo = validated_data.get('logo', instance.logo)
        if slideshow_data:
            instance.slideshow = slideshow_data
        instance.save()
        return instance