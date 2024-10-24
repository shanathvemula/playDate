from rest_framework.serializers import ModelSerializer

from grounds.models import Grounds, Arena


class GroundsSerializerDepth(ModelSerializer):
    class Meta:
        model = Grounds
        fields = '__all__'
        depth=1

class GroundsSerializer(ModelSerializer):
    class Meta:
        model = Grounds
        fields = '__all__'

class ArenaSerializer(ModelSerializer):
    class Meta:
        model = Arena
        fields = '__all__'