# Django Import
import json
import os
from datetime import datetime, timedelta

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
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

# Mail Imports
import email, smtplib, ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


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
# from rest_framework_simplejwt.tokens import AccessToken

# drf_spectacular
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample, extend_schema_view, \
    extend_schema_serializer, extend_schema_field
from drf_spectacular.types import OpenApiTypes

# django-phonenumber-field
from phonenumber_field.phonenumber import PhoneNumber
from phonenumber_field.phonenumber import to_python as parse_phone_number
import phonenumbers
from phonenumbers.phonenumberutil import NumberParseException

# cryptography
from cryptography.fernet import InvalidToken

import playDate.settings
from app.serializer import (User, UserSerializer, Group, GroupSerializer, Permission, PermissionSerializer,
                            ContentType, ContentTypeSerializer, UserSerializerDepth, PermissionsSerializer,
                            SiteManagement, SiteManagementsSerializer, UserSignUpSerializer,
                            UserForgetPasswordSerializer, ForgetPasswordSerializer)
from playDate.settings import BASE_DIR
from playDate.settings import EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, EMAIL_HOST, EMAIL_PORT, fernet


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

def validate_phone_number(phone):
    # Convert the input to a phone number object
    phone_number = parse_phone_number(phone)
    # Check if the phone number is valid (exists in the phonenumbers library)
    return phone_number and phone_number.is_valid()

def validate_email_address(email):
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False

def is_valid_phone_number(phone_number, region='IN'):
    try:
        parsed_number = phonenumbers.parse(phone_number, region)
        return phonenumbers.is_valid_number(parsed_number)
    except NumberParseException:
        return False

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
class SignUp(APIView):
    queryset = User.objects.all()
    serializer_class = UserSignUpSerializer
    authentication_classes = []
    permission_classes = []

    @staticmethod
    @extend_schema(exclude=True)
    def get(request, *args, **kwargs):
        try:
            # print(request.headers)
            if "Authorization" in request.headers:
                token = request.headers['Authorization'].split(' ')[-1]
                access_token_obj = AccessToken(token)
                user = User.objects.get(id__exact=access_token_obj['user_id'])
                data = UserSerializer(user).data
                return HttpResponse(JSONRenderer().render(data),
                                    content_type='application/json',
                                    status=status.HTTP_200_OK)
            else:
                return HttpResponse(JSONRenderer().render({}), content_type='application/json',
                                                        status=status.HTTP_200_OK)
        except Exception as e:
            # raise e
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=UserSignUpSerializer, summary="User SignUp", description="* This endpoint helps to sign up the user \n"
                                                                                    "* Make email will be null or empty string")
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            print("data", data)
            password = request.data.get('password')
            validate_password(password=data['password'], user=User)
            data['password'] = make_password(data['password'])
            email=None
            if validate_email_address(data['username']):
                data['email'] = data['username']
                email = True
            if validate_phone_number(data['username']):
                data['phone'] = data['username']
                email= False
            serializer = UserSignUpSerializer(data=data)
            print("serializer:", serializer.is_valid(), serializer.errors)
            if serializer.is_valid():
                if email is not None:
                    user = User(**data)
                    user.save()
                    if email:
                        print("email", email)
                        with open(os.path.join(BASE_DIR / "templates" / "mail_templates" / "Registration_template.html"),
                                  "r") as html:
                            body = html.read()
                        # logo_path = os.path.join( "media", "logo", "Logo_without_background.png")
                        # logInURL = os.getenv("logInURL")
                        # print(os.getenv('logoURL'))
                        body = (body.replace("{{ logo_path }}",os.getenv('logoURL')).replace("{{ app_name }}", os.getenv('app_name'))
                                .replace("{{ first_name }}", data['first_name']).replace("{{ email }}",data['email'])
                                .replace("{{ logInURL }}", os.getenv("logInURL")).replace("{{ current_year }}", str(datetime.now().year))
                                .replace("{{ company_address }}", os.getenv("company_address"))
                                .replace("{{ supportMail }}", os.getenv("supportMail"))
                                .replace("<li><strong>Password:</strong> {{ password }}</li>", ''))
                        send_mail(to=data['email'], subject=f"Welcome to {os.getenv('app_name')}! Thank you for registering", body=body)
                    return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json',
                                        status=status.HTTP_201_CREATED)
                return HttpResponse(JSONRenderer().render({"error":"Please provide the valid info. E-mail or phone number field not allow thw space"}),
                                    content_type='application', status=status.HTTP_400_BAD_REQUEST)
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # raise e
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=UserSignUpSerializer, summary="Forget Password", description="* This endpoint helps to generate the forget password mail.\n"
                                                                                        "* password and first_name will be null or empty.")
    def put(self, request, *args, **kwargs):
        try:
            data = request.data
            user = User.objects.get(username__exact=data['username'])
            if user:
                if user.email:
                    d = str({"email":user.username, "timeout": str(datetime.now()+timedelta(days=2)), "password_reset":True})
                    encrptMessage = str(fernet.encrypt(d.encode())).replace("b'",'').replace("'",'')
                    # print(encrptMessage)
                    reset_link = os.getenv("forget_password_url")+"?token="+encrptMessage
                    with open(os.path.join(BASE_DIR / "templates" / "mail_templates" / "forget_password.html"),
                              "r") as html:
                        body = html.read()
                        body = (body.replace("{{ logo_path }}",os.getenv('logoURL')).replace("{{ reset_link }}", reset_link)
                                .replace("{{ supportMail }}", os.getenv("supportMail")).replace("{{ current_year }}", str(datetime.now().year))
                                .replace("{{ company_address }}", os.getenv("company_address")).replace("{{ app_name }}", os.getenv('app_name'))
                                .replace("{{ user_name }}", user.first_name))
                        send_mail(to=user.email,
                                  subject=f"Password Reset Request for Your {os.getenv('app_name')} Account", body=body)
                        return HttpResponse(JSONRenderer().render({"message":"Reset mail sent"}), content_type='application/json',
                                            status=status.HTTP_200_OK)
                    # print(fernet.decrypt(eval(encrptMessage)))
                    # print(type(eval(encrptMessage).decode()))
                else:
                    return HttpResponse(JSONRenderer().render({"Error": "No mail info"}), content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
            else:
                return HttpResponse(JSONRenderer().render({"Error": "user does n't exists"}), content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        # parameters=[
        #     OpenApiParameter(name='token', description="Enter reset token", required=True, type=str),
        #     OpenApiParameter(name='password',description="Enter reset password", type=str),
        #     OpenApiParameter(name='confirm_password', description="Enter Re-Password", type=str)
        # ],
        request=ForgetPasswordSerializer, summary="validating Forgot token and update password",
        description="* This endpoint helps to validate the forget token"
    )
    def patch(self, request, *args, **kwargs):
        try:
            data = request.data
            token = data['token']
            password = data['password']
            confirm_password = data['confirm_password']
            data = eval(fernet.decrypt(eval("b'" + token + "'")).decode())
            data['timeout'] = datetime.strptime(data['timeout'], '%Y-%m-%d %H:%M:%S.%f')
            # print(data)
            # print(data['timeout']>datetime.now())
            if not data['password_reset']:
                return HttpResponse(JSONRenderer().render({"error": "Reset token is not valid."}),
                                    content_type='application/json',
                                    status=status.HTTP_400_BAD_REQUEST)
            elif data['timeout'] > datetime.now():
                if password == confirm_password:
                    user = User.objects.filter(email__exact=data['email'])
                    validate_password(password=password, user=User)
                    hashed_password = make_password(password)
                    user.update(password=hashed_password)
                    return HttpResponse(JSONRenderer().render({"message": "Password updated successfully"}),
                                        content_type='application/json',
                                        status=status.HTTP_200_OK)
                else:
                    return HttpResponse(
                        JSONRenderer().render({"Error": "password and confirm password has to be same."}),
                        content_type='application/json',
                        status=status.HTTP_400_BAD_REQUEST)
            else:
                return HttpResponse(JSONRenderer().render({"Error": "Reset link expired."}),
                                    content_type='application/json',
                                    status=status.HTTP_400_BAD_REQUEST)
        except InvalidToken:
            return HttpResponse(JSONRenderer().render({"Error": "Invalid token"}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)
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
            OpenApiParameter(name='username', description="Enter Username", type=str),
            OpenApiParameter(name='id', description="Enter Id", type=int),
        ], summary="Get User", description="* This endpoint provides the user details by using username or id.")
    def get(request, *args, **kwargs):
        try:
            username = request.GET.get('username', None)
            id = request.GET.get('id', None)
            if username:
                user = User.objects.get(username__exact=username)
            elif id:
                user = User.objects.get(id__exact=id)
            else:
                return HttpResponse(JSONRenderer().render({"Error": "Please provide the username or id."}),
                                    content_type='application/json',
                                    status=status.HTTP_400_BAD_REQUEST)
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
            email=None
            if 'email' in data.keys() and data['email'] not in ['', None, ' ']:
                data['username'] = data['email']
                email=True
            elif 'phone' in data.keys() and data['phone'] not in ['', None, ' ']:
                data['username'] = data['phone']
            else:
                return HttpResponse(JSONRenderer().render({"Error": "PLease provide the email or phone number"}),
                                    content_type='application/json',
                                    status=status.HTTP_400_BAD_REQUEST)
            validate_password(password=data['password'], user=User)
            data['password'] = make_password(data['password'])
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                if email:
                    print("email", email)
                    with open(os.path.join(BASE_DIR / "templates" / "mail_templates" / "Registration_template.html"),
                              "r") as html:
                        body = html.read()
                    # logo_path = os.path.join( "media", "logo", "Logo_without_background.png")
                    # logInURL = os.getenv("logInURL")
                    # print(os.getenv('logoURL'))
                    body = (body.replace("{{ logo_path }}", os.getenv('logoURL')).replace("{{ app_name }}",
                                                                                          os.getenv('app_name'))
                            .replace("{{ first_name }}", data['first_name']).replace("{{ email }}", data['email'])
                            .replace("{{ logInURL }}", os.getenv("logInURL")).replace("{{ current_year }}",
                                                                                      str(datetime.now().year))
                            .replace("{{ company_address }}", os.getenv("company_address"))
                            .replace("{{ password }}", password)
                            .replace("{{ supportMail }}", os.getenv("supportMail")))
                    send_mail(to=data['email'],
                              subject=f"Welcome to {os.getenv('app_name')}! Thank you for registering", body=body)
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


    @extend_schema(
        parameters=[
            # OpenApiParameter(name='username', description="Enter Username", type=str),
            OpenApiParameter(name='id', description="Enter Id", type=int),
        ], summary="Delete User", description="* This endpoint helps to deleting user.")
    def delete(self, request, *args, **kwargs):
        try:
            id = request.GET.get('id')
            user = User.objects.get(id__exact=id)
            user.delete()
            return HttpResponse(JSONRenderer().render({"message": "Deleted Successfully"}), content_type='application/json',
                                status=status.HTTP_200_OK)
        except Exception as e:
            # raise e
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
    serializer_class = SiteManagementsSerializer
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
        try:
            sites = SiteManagement.objects.all()
            if sites:
                serializer = SiteManagementsSerializer(sites, many=True)
                data = serializer.data[0]
                if data['slideshow']:
                    data['slideshow'] = ['/media/' + x['path'] for x in data['slideshow'][0]]
                return Response(data, content_type='application/json', status=status.HTTP_200_OK)
            else:
                return Response({"message":"No data found"}, content_type='application/json', status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":str(e)}, content_type='application/json', status=status.HTTP_404_NOT_FOUND)


class SiteManagementLC(ListCreateAPIView):
    queryset = SiteManagement.objects.all()
    serializer_class = SiteManagementsSerializer
    permission_classes = []
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        try:
            sites = SiteManagement.objects.all()
            if sites:
                serializer = SiteManagementsSerializer(sites, many=True)
                data = serializer.data[0]
                return Response(data, content_type='application/json', status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":str(e)}, content_type='application/json', status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
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

        except Exception as e:
            return Response({"error":str(e)}, content_type='application/json', status=status.HTTP_404_NOT_FOUND)

import csv
import pandas as pd

import secrets
import string



class ImportUser(APIView):
    authentication_classes = []
    permission_classes = []
    parser_classes = (MultiPartParser, FormParser)

    def generate_random_password(self, length=12):
        alphabet = string.ascii_letters + string.digits + string.punctuation
        return ''.join(secrets.choice(alphabet) for _ in range(length))

    def post(self, request, *args, **kwargs):
        file = request.data['file']
        file_name = file.name
        file_contents = file.read()

        # Check the file extension
        if file_name.endswith('.csv'):
            file_contents_str = file_contents.decode('utf-8') if file_contents.decode('utf-8') else file_contents
            reader = csv.DictReader(file_contents_str.splitlines())
            df = pd.DataFrame(reader)

        elif file_name.endswith('.xlsx') or file_name.endswith('.xls'):
            # For Excel files
            df = pd.read_excel(file)

        else:
            return HttpResponse(JSONRenderer().render({"error": "Unsupported file format"}),
                                content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

        # Print DataFrame (for debugging, optional)
        user_profiles = []
        errors = []
        error_sno = []
        for index, row in df.iterrows():
            username = [x for x in [row['email'], row['phone']] if x]
            print("username", username)
            if username:
                row['username'] = username[0]
                password = self.generate_random_password()
                if 'dob' in row and row['dob']:
                    date_of_birth = datetime.strptime(row['dob'], '%d-%m-%Y').date()
                else:
                    date_of_birth = None
                user_dict = {"username": row['username'], "first_name": row['first_name'],
                             "last_name": row['last_name'], "email": row['email'], "age": row['age'],
                             "alternate_phone": row['alternate_phone'], "dob": date_of_birth, "gender": row['gender'],
                             "phone": row['phone'], "user_type": row['user_type'], "password": password}
                serializer = UserSerializer(data=user_dict)
                if serializer.is_valid():
                    serializer.save()
                else:
                    error_sno.append(row['S.no'])
                    errors.append({row['username']: serializer.errors})
            else:
                error_sno.append(row['S.no'])
                errors.append({row['S.no']: "Please provide email or phone number"})
                continue
        if errors:
            return HttpResponse(JSONRenderer().render({"error": "Please check the rows "+ ', '.join(error_sno)}),
                                content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            return HttpResponse(JSONRenderer().render({"message": "File processed successfully"}),
                                    content_type='application/json',
                                    status=status.HTTP_200_OK)

        #     user_profiles.append(user_dict)
        #
        # serializer = UserSerializer(data=user_profiles, many=True)
        # if serializer.is_valid():
        #     serializer.save()
        #     return HttpResponse(JSONRenderer().render({"message": "File processed successfully"}),
        #                         content_type='application/json',
        #                         status=status.HTTP_200_OK)
        # return HttpResponse(JSONRenderer().render({"error": serializer.errors}),
        #                     content_type='application/json',
        #                     status=status.HTTP_400_BAD_REQUEST)

# from rest_framework_simplejwt.tokens import AccessToken
# from django.contrib.auth.models import User
#
# @extend_schema()
# class UserToken(APIView):
#     permission_classes = []
#     authentication_classes = [JWTAuthentication]
#     serializer_class = UserSerializer
#
#     def post(self, request, *args, **kwargs):
#         try:
#             token = request.headers['Authorization'].split(' ')[-1]
#             access_token_obj = AccessToken(token)
#             user = User.objects.get(id__exact=access_token_obj['user_id'])
#             data = UserSerializer(user).data
#             return HttpResponse(JSONRenderer().render(data),
#                                 content_type='application/json',
#                                 status=status.HTTP_200_OK)
#         except Exception as e:
#             # raise e
#             return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
#                                 status=status.HTTP_400_BAD_REQUEST)

class ContactUs(APIView):
    authentication_classes = []
    permission_classes = []
    # parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            print(data)
            body = (f"<h3>Name:  </h3> {data['name']}<br>"
                    f"<h3>Email:  </h3> {data['email']}<br>"
                    f"<h3>Phone:  </h3> {data['phone']}<br>"
                    f"<h3>Subject:  </h3> {data['subject']}<br>"
                    f"<h3>Message:  </h3> {data['message']}")
            print(EMAIL_HOST_USER)
            send_mail(to=EMAIL_HOST_USER, subject="From Contact us page", body=body)
            return HttpResponse(JSONRenderer().render({"message": "Message sent successfully"}),
                                content_type='application/json',
                                status=status.HTTP_200_OK)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"error": "Something went wrong"}),
                                content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)
        # serializer = ContactUsSerializer(data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return HttpResponse(JSONRenderer().render({"message": "Message sent successfully"}),
        #                         content_type='application/json',
        #                         status=status.HTTP_200_OK)
        # return HttpResponse(JSONRenderer().render({"error": serializer.errors}),
        #                     content_type='application/json',
        #                     status=status.HTTP_400_BAD_REQUEST)