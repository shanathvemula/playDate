# from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework import serializers

from tournament.models import Tournament, Teams, MatchScore, GroundNew, Matches

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

class GroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroundNew
        fields = ['id', 'ground_name', 'name', 'address', 'type', 'capacity', 'availability_status']
        # include only the fields you want

class TournamentGroundsListSerializer(serializers.ModelSerializer):
    ground = GroundSerializer(many=True, read_only=True)  # nested serializer

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'start_date', 'capacity',
                  'end_date', 'address', 'price', 'registered_count',
                  'status', 'ground', 'game', 'price_pool'] #  'images', 'ground'

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

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matches
        fields = '__all__'