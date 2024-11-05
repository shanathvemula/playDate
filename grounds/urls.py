from django.urls import path

from grounds.views import GroundLC, Ground, GroundManagementCRUD

urlpatterns = [
    path('ground_list/', GroundLC.as_view()),
    path('ground/', Ground.as_view()),
    path('ground_management/', GroundManagementCRUD.as_view()),
]
