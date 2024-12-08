from django.urls import path

from grounds.views import GroundLC, Ground, GroundManagementCRUD, GroundCRUD, GroundsData, PriceCalculator

urlpatterns = [
    path('ground_list/', GroundLC.as_view()),
    path('ground/', Ground.as_view()),
    path('ground_management/', GroundManagementCRUD.as_view()),
    path('ground_new/', GroundCRUD.as_view()),
    path('ground_info/', GroundsData.as_view()),
    path('price_calculator/', PriceCalculator.as_view()),  # Add endpoint for price calculation here.  # This is a placeholder. You need to implement this endpoint.  # Add endpoint for price calculation here.  # This is a placeholder. You need to implement this endpoint.  # Add endpoint for price calculation here.  # This is a placeholder. You need to implement this endpoint.  # Add endpoint for price calculation here.  # This is a placeholder. You
]
