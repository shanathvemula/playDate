# """
# ASGI config for playDate project.
#
# It exposes the ASGI callable as a module-level variable named ``application``.
#
# For more information on this file, see
# https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
# """
#
# # import os
# #
# # from django.core.asgi import get_asgi_application
# #
# # os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'playDate.settings')
# #
# # application = get_asgi_application()
#
# # asgi.py
# import os
# from channels.auth import AuthMiddlewareStack
# from channels.routing import ProtocolTypeRouter, URLRouter
# from django.core.asgi import get_asgi_application
# from channels.security.websocket import AllowedHostsOriginValidator
# from app.middleware import JWTAuthMiddlewareStack
# import app.routing
#
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'playDate.settings')
#
# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AllowedHostsOriginValidator(
#         JWTAuthMiddlewareStack(
#             URLRouter(
#                 app.routing.websocket_urlpatterns
#             )
#         )
#     ),
# })


# asgi.py

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from app.routing import app_websocket_urlpatterns
from grounds.routing import ground_websocket_urlpatterns
from payments.routing import payments_websocket_urlpatterns
from tournament.routing import tournament_websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'playDate.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(
            app_websocket_urlpatterns + ground_websocket_urlpatterns + payments_websocket_urlpatterns
            + tournament_websocket_urlpatterns
        ),
    # "websocket": AuthMiddlewareStack(
    #     URLRouter(
    #         websocket_urlpatterns
    #     )
    # ),
})
