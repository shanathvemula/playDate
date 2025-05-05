from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.permissions import IsAuthenticated

from channels.db import database_sync_to_async

from urllib.parse import parse_qs

from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D

from tournament.serializers import TournamentSerializerDepth, TournamentSerializer, Tournament

class TournamentConsumer(GenericAsyncAPIConsumer):
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]

    @model_observer(Tournament)
    async def model_changed(self, message, *args, **kwargs):
        await self.send_json(message)

    @model_changed.serializer
    def model_serializer(self, instance, action, **kwargs):
        tournaments = TournamentSerializer(instance=instance).data
        return {'action': action.value, 'data':tournaments}


    async def connect(self, **kwargs):
        await super().connect()
        await self.send_initial_json()
        await self.model_changed.subscribe()

    async def disconnect(self, code):
        await self.model_changed.unsubscribe()
        await super().disconnect(code)

    @database_sync_to_async
    def fetch_initial_data(self, **kwargs):
        return TournamentSerializer(Tournament.objects.all().order_by('-created_by'), many=True).data

    async def send_initial_json(self):
        initial_data = await self.fetch_initial_data()
        await self.send_json({'action':'initial', 'data':initial_data})


