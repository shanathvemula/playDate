from rest_framework.serializers import ModelSerializer

from grounds.models import Grounds, GroundManagement # Arena


class GroundsSerializerDepth(ModelSerializer):
    class Meta:
        model = Grounds
        fields = '__all__'
        depth=1

class GroundsSerializer(ModelSerializer):
    class Meta:
        model = Grounds
        fields = '__all__'

# class ArenaSerializer(ModelSerializer):
#     class Meta:
#         model = Arena
#         fields = '__all__'

class GroundManagementSerializer(ModelSerializer):
    class Meta:
        model = GroundManagement
        fields = '__all__'