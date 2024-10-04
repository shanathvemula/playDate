from django.contrib import admin
from django.urls import path

from app.views import (ContentTypeLC, PermissionsLC, GroupLC, GroupRUD, UserCRUD, UserGET, SiteManagementCRUD)

urlpatterns = [
    path('contenttypes/', ContentTypeLC.as_view()),
    path('permissions/', PermissionsLC.as_view()),
    path('groups/', GroupLC.as_view()),
    path('groups/<pk>', GroupRUD.as_view()),
    path('user/', UserCRUD.as_view(), name="User"),
    path('user_list/', UserGET.as_view()),
    path('SiteManagement/', SiteManagementCRUD.as_view()),
]
