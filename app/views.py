# Django Import
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate
from django.core.cache import cache
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils.timezone import now
from django.shortcuts import render

# Mail Imports
import email, smtplib, ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from playDate.settings import EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, EMAIL_HOST, EMAIL_PORT

# REST Framework
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import (IsAdminUser, IsAuthenticated, DjangoModelPermissions,
                                        DjangoModelPermissionsOrAnonReadOnly)

# REST Framework simplejwt
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

# drf_spectacular
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample, extend_schema_view, \
    extend_schema_serializer, extend_schema_field
from drf_spectacular.types import OpenApiTypes

import playDate.settings
from app.serializer import (User, UserSerializer, Group, GroupSerializer, Permission, PermissionSerializer,
                            ContentType, ContentTypeSerializer, UserSerializerDepth, PermissionsSerializer,
                            SiteManagement, SiteManagementSerializer, SiteManagementsSerializer)


def send_mail(to, subject, body, body_type='html'):
    try:
        message = MIMEMultipart()
        message['From'] = EMAIL_HOST_USER
        message['cc'] = EMAIL_HOST_USER
        message['To'] = to
        message['subject'] = subject
        message.attach(MIMEText(body, body_type))
        # message.attach(MIMEText('<h1>Thadam Credentials</h1>', "html"))
        text = message.as_string()
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT, context=context) as mail:
            mail.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            # print("login successfull")
            mail.sendmail(EMAIL_HOST_USER, [to], text)
            # print("Mail sent successfull")
            mail.quit()
        return "Mail Sent Successfully"
    except Exception as e:
        return str(e)


@method_decorator(csrf_exempt, name='dispatch')
# @extend_schema
class UserGET(APIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]

    @staticmethod
    @extend_schema(summary="Get User List", description="* This endpoint provides the list of users")
    def get(request, *args, **kwargs):
        try:
            username = request.GET.get('username')
            # from django_user_agents.utils import get_user_agent
            # print('headers', get_user_agent(request))
            # print(request.META.get('REMOTE_ADDR'))
            user = User.objects.all()
            serializer = UserSerializer(user, many=True)
            return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json')
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class UserCRUD(APIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [DjangoModelPermissions]

    @staticmethod
    @extend_schema(
        parameters=[
            OpenApiParameter(name='username', description="Enter Username", required=True, type=str)
        ], summary="Get User", description="* This endpoint provides the user details by using username")
    def get(request, *args, **kwargs):
        try:
            username = request.GET.get('username')
            user = User.objects.get(username__exact=username)
            serializer = UserSerializerDepth(user).data
            user_permissions = []
            groups = []
            for group in user.groups.all():
                groups.append(group.name)
                for permission in group.permissions.all():
                    user_permissions.append(permission.name)
            for permission in user.user_permissions.all():
                user_permissions.append(permission.name)
            serializer['groups'] = groups
            serializer['user_permissions'] = user_permissions
            return HttpResponse(JSONRenderer().render(serializer), content_type='application/json')
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=UserSerializer, summary="Create User", description="* This endpoint helps to create a user")
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            password = request.data.get('password')
            validate_password(password=data['password'], user=User)
            data['password'] = make_password(data['password'])
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json',
                                    status=status.HTTP_201_CREATED)
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=UserSerializer, summary="Update User", description=f"* Updating User details.\n"
                                                                              f"* This endpoint helps to updating "
                                                                              f"user. \n "
                                                                              f"* Provide the fields to what are need "
                                                                              f"to update with username. \n"
                                                                              f"* Send is_active as false for "
                                                                              f"deleting user. \n"
                                                                              f"* username is required field")
    def put(self, request, *args, **kwargs):
        try:
            data = request.data
            user = User.objects.get(username__exact=data['username'])
            if 'password' in data.keys():
                validate_password(password=data['password'], user=User)
                data['password'] = make_password(data['password'])
            serializer = UserSerializer(user, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json')
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
@extend_schema(request=GroupSerializer, summary="Group Operations",
               description="This endpoint helps to Listing and Creating Groups")
class GroupLC(ListCreateAPIView):
    permission_classes = [DjangoModelPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Group.objects.all().order_by('-id')
    serializer_class = GroupSerializer


@method_decorator(csrf_exempt, name='dispatch')
@extend_schema(request=GroupSerializer, summary="Group Operations",
               description="This endpoint helps to Retrieve, Update and Delete")
class GroupRUD(RetrieveUpdateDestroyAPIView):
    permission_classes = [DjangoModelPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Group.objects.all().order_by('-id')
    serializer_class = GroupSerializer


@method_decorator(csrf_exempt, name='dispatch')
@extend_schema(request=PermissionsSerializer, summary="Permission Operations",
               description="This endpoint helps to Listing and Creating Permissions")
class PermissionsLC(ListCreateAPIView):
    permission_classes = [DjangoModelPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Permission.objects.all().order_by('-id')
    serializer_class = PermissionsSerializer


@method_decorator(csrf_exempt, name='dispatch')
@extend_schema(request=ContentTypeSerializer, summary="Content Type Operations",
               description="This endpoint helps to Listing and Creating Content Type")
class ContentTypeLC(ListCreateAPIView):
    permission_classes = [DjangoModelPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = ContentType.objects.all().order_by('-id')
    serializer_class = ContentTypeSerializer


@method_decorator(csrf_exempt, name='dispatch')
@extend_schema(request=SiteManagementsSerializer, summary="Site Management", )
# description="This endpoint helps to rest password.")
class SiteManagementCRUD(APIView):
    permission_classes = []
    authentication_classes = []
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        data = request.data
        slideshow = request.FILES.getlist('slideshow')
        image_data = []
        for file in slideshow:
            path = default_storage.save('images/' + file.name, ContentFile(file.read()))
            image_data.append({'path': path})
        data['slideshow'] = image_data
        site = SiteManagement.objects.all()
        if site:
            serializer = SiteManagementsSerializer(site[0], data=data, partial=True)
            s = status.HTTP_200_OK
        else:
            serializer = SiteManagementsSerializer(data=data)
            s = status.HTTP_201_CREATED
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,
                            content_type='application/json',
                            status=s)
        else:
            return HttpResponse(JSONRenderer().render(serializer.errors),
                                content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        sites = SiteManagement.objects.all()
        if sites:
            serializer = SiteManagementsSerializer(sites, many=True)
            data = serializer.data[0]
            data['slideshow'] = ['/media/' + x['path'] for x in data['slideshow'][0]]
            return Response(data, content_type='application/json', status=status.HTTP_200_OK)


class SiteManagementView(APIView):
    authentication_classes = []
    permission_classes = []
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(parameters=[
        OpenApiParameter(name='Name', description='Enter Name of the Site', type=str, default='')
    ], summary="Get Site details", description="This endpoint provides the Site details")
    def get(self, request, *args, **kwargs):
        name = request.query_params.get("name")
        site_managements = SiteManagement.objects.get(name=name)
        serializer = SiteManagementSerializer(site_managements)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()  # Make a mutable copy of the request data
        serializer = SiteManagementSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            site_management = SiteManagement.objects.get(pk=pk)
        except SiteManagement.DoesNotExist:
            return Response({"error": "SiteManagement not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()  # Make a mutable copy of the request data
        serializer = SiteManagementSerializer(site_management, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)