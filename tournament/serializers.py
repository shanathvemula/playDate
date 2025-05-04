from rest_framework.serializers import ModelSerializer

from tournament.models import Tournament

class TournamentSerializerDepth(ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'
        depth = 1

class TournamentSerializer(ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'