from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.response import Response
from django.contrib.auth.models import User
import urllib
import requests
import jwt
from drf_spectacular.utils import extend_schema

import os
from dotenv import load_dotenv

from playDate.settings import BASE_DIR

env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path)


def get_jwt_token(user):
    token = AccessToken.for_user(user)
    return str(token)


def authenticate_or_create_user(email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(username=email, email=email)
    return user


def get_id_token_with_code_method(code):
    redirect_uri = "postmessage"
    token_endpoint = "https://oauth2.googleapis.com/token"
    payload = {
        'code': code,
        'client_id': os.getenv('client_id'),
        'client_secret': os.getenv('client_secret'),
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code',
    }
    body = urllib.parse.urlencode(payload)
    headers = {
        'content-type': 'application/x-www-form-urlencoded',
    }

    response = requests.post(token_endpoint, data=body, headers=headers)
    if response.ok:
        id_token = response.json()['id_token']
        return jwt.decode(id_token, options={"verify_signature": False})
    else:
        # print(response.json())
        return None


class LoginWithGoogle(APIView):
    @extend_schema(exclude=True)
    def post(self, request):
        if 'code' in request.data.keys():
            code = request.data['code']
            id_token = get_id_token_with_code_method(code)
            user_email = id_token['email']
            user = authenticate_or_create_user(user_email)
            token = get_jwt_token(user)
            return Response({'access_token': token, 'username': user_email, 'status': 'success'})
