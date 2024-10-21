from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.permissions import IsAuthenticated

from channels.db import database_sync_to_async

from grounds.serializers import Grounds, GroundsSerializer

class GroundConsumer(GenericAsyncAPIConsumer):
    serializer_class = GroundsSerializer
    permission_classes = [IsAuthenticated]

    @model_observer(Grounds)
    async def model_changed(self, message, observer=True, **kwargs):
        await self.send_json(message)

    @model_changed.serializer
    def model_serializer(self, instance, action, **kwargs):
        ground = GroundsSerializer(instance=instance).data
        return {'action': action.value, 'data': ground}

    async def connect(self, **kwargs):
        await super(GroundConsumer, self).connect()
        await self.send_initial_json()
        await self.model_changed.subscribe()

    async def disconnect(self, code):
        await self.model_changed.unsubscribe()
        await super().disconnect(code)


    @database_sync_to_async
    def get_initial_data(self):
        return GroundsSerializer(Grounds.objects.all().order_by('-id'), many=True).data

    async def send_initial_json(self):
        initial_data = await self.get_initial_data()
        await self.send_json({
            'action':'initial',
            'data': initial_data,
        })