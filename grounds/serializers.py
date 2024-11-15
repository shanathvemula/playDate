from rest_framework.serializers import ModelSerializer

from grounds.models import Grounds, GroundManagement, GroundNew # Arena


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

class GroundNewSerializer(ModelSerializer):
    class Meta:
        model = GroundNew
        # exclude = ['id']
        fields = '__all__'
