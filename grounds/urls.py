from django.urls import path

from grounds.views import GroundLC, Ground

urlpatterns = [
    path('ground_list/', GroundLC.as_view()),
    path('ground/', Ground.as_view())
]
