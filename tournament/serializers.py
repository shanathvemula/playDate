# from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework import serializers

from tournament.models import Tournament, Teams

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
        fields = ['ground']
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

