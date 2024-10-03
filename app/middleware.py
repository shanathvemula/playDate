# yourapp/middleware.py

# from user_agents import parse
from django.conf import settings
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.core.cache import cache
# from app.models import BlockedIps
import json


# class UserAgentMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response
#
#     def __call__(self, request):
#         user_agent_string = request.META.get('HTTP_USER_AGENT', '')
#         # print(user_agent_string)
#         user_agent = parse(user_agent_string)
#         request.device = {
#             'is_mobile': user_agent.is_mobile,
#             'is_tablet': user_agent.is_tablet,
#             'is_pc': user_agent.is_pc,
#             'browser': user_agent.browser.family,
#             'browser_version': user_agent.browser.version_string,
#             'os': user_agent.os.family,
#             'os_version': user_agent.os.version_string,
#             'device': user_agent.device.family,
#         }
#         response = self.get_response(request)
#         return response


# class BlockMiddleware(MiddlewareMixin):
#     def process_request(self, request):
#         # try:
#         #     request_data = json.loads(request.body)
#         # except json.JSONDecoderError:
#         #     request_data = {}
#         ip = self.get_client_ip(request)
#         login_attempt = cache.get(ip)
#         # print(login_attempt)
#         # login_attempt = BlockedIps.objects.get_or_create(ip=ip)[0]  # , username=request_data.get('username')
#         # print(filed_attempts[0].no_of_attempts)
#         # filed_attempts = 0
#
#         # if login_attempt and login_attempt.no_of_attempts >= 3:
#         if login_attempt is not None and login_attempt >= 3:
#             return JsonResponse({"detail": "You have been temporarily blocked due to multiple failed login attempts. "
#                                            "Try after 60 seconds."},
#                                 status=403)
#
#         if request.path in ['/Token/obtain_token/', '/Token/otp_obtain_token/'] and request.method == 'POST':
#             response = self.get_response(request)
#             content = json.loads(response.content).get('error', None)
#
#             if response.status_code == 200:
#                 cache.delete(ip)
#                 # login_attempt.no_of_attempts = 0
#                 # login_attempt.save()
#             if response.status_code == 401 and content == "Invalid credentials, Please enter valid login details.":
#                 # print(login_attempt)
#                 if login_attempt is None:
#                     cache.set(ip, 1, timeout=60)
#                 else:
#                     cache.set(ip, login_attempt + 1, timeout=60)  # in seconds
#                 # login_attempt.no_of_attempts += 1
#                 # login_attempt.save()
#             return response
#
#     @staticmethod
#     def get_client_ip(request):
#         x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#         if x_forwarded_for:
#             ip = x_forwarded_for.split(',')[0]
#         else:
#             ip = request.META.get('REMOTE_ADDR')
#         return ip


# middlewares.py
# from rest_framework_simplejwt.tokens import AccessToken
# from django.contrib.auth.models import AnonymousUser
# from channels.db import database_sync_to_async
# from django.conf import settings
# from django.contrib.auth import get_user_model
#
#
# @database_sync_to_async
# def get_user(user_id):
#     User = get_user_model()
#     try:
#         return User.objects.get(id=user_id)
#     except User.DoesNotExist:
#         return AnonymousUser()
#
#
# class JWTAuthMiddleware:
#     def __init__(self, inner):
#         self.inner = inner
#
#     async def __call__(self, scope, receive, send):
#         headers = dict(scope['headers'])
#         print('headers', headers)
#
#         if b'authorization' in headers:
#             token_name, token_key = headers[b'authorization'].decode().split()
#             print("token_name", token_name)
#             if token_name == 'Bearer':
#                 try:
#                     access_token = AccessToken(token_key)
#                     user = await get_user(access_token['user_id'])
#                     scope['user'] = user
#                 except Exception as e:
#                     scope['user'] = AnonymousUser()
#             else:
#                 scope['user'] = AnonymousUser()
#         else:
#             scope['user'] = AnonymousUser()
#
#         return await self.inner(scope, receive, send)
#
#
# def JWTAuthMiddlewareStack(inner):
#     return JWTAuthMiddleware(inner)
