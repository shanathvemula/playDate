from rest_framework.serializers import ModelSerializer

from grounds.models import Grounds


class GroundsSerializer(ModelSerializer):
    class Meta:
        model = Grounds
        fields = '__all__'
