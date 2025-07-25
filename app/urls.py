from django.contrib import admin
from django.urls import path

from app.views import (ContentTypeLC, PermissionsLC, GroupLC, GroupRUD, UserCRUD, UserGET, SiteManagementLC,
                       SignUp, ImportUser, ContactUs)
from app.google_login import LoginWithGoogle

urlpatterns = [
    path('contenttypes/', ContentTypeLC.as_view()),
    path('permissions/', PermissionsLC.as_view()),
    path('groups/', GroupLC.as_view()),
    path('groups/<pk>', GroupRUD.as_view()),
    path('user/', UserCRUD.as_view(), name="User"),
    path('user_list/', UserGET.as_view()),
    path('SiteManagement/', SiteManagementLC.as_view()),
    path('signup/', SignUp.as_view()),
    path('login-with-google/', LoginWithGoogle.as_view(), name='login-with-google'),
    path('import_user/', ImportUser.as_view()),
    path('contact-us/', ContactUs.as_view()),
    # path('user_token/', UserToken.as_view()),
]