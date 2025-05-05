from rest_framework.serializers import ModelSerializer

from tournament.models import Tournament, Teams

class TournamentSerializerDepth(ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'
        depth = 1

class TournamentSerializer(ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'

class TeamsSerializer(ModelSerializer):
    class Meta:
        model = Teams
        fields = '__all__'

class TeamsSerializerDepth(ModelSerializer):
    class Meta:
        model = Teams
        fields = '__all__'
        depth = 1