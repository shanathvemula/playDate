# from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework import serializers

from tournament.models import Tournament, Teams, MatchScore, GroundNew

class TournamentSerializerDepth(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'
        depth = 1

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'

class TournamentGroundsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['status', 'ground']
        depth = 1

class IdSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=25)

class TeamsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teams
        fields = '__all__'

class TeamsSerializerDepth(serializers.ModelSerializer):
    class Meta:
        model = Teams
        fields = '__all__'
        depth = 1


class MatchScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchScore
        fields = '__all__'

class MatchScoreSerializerDepth(serializers.ModelSerializer):
    class Meta:
        model = MatchScore
        fields = '__all__'
        depth = 1

# Custom Ground serializer with only id and name
class GroundMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroundNew
        fields = ['id', 'ground_name']  # or 'name' if needed


class TournamentGroundDepthSerializers(serializers.ModelSerializer):
    ground = GroundMinimalSerializer(many=True)

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'ground']
        depth = 1