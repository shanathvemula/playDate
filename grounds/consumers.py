from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.permissions import IsAuthenticated

from channels.db import database_sync_to_async

from grounds.serializers import Grounds, GroundsSerializer, GroundManagementSerializer, GroundManagement, GroundNew, GroundNewSerializer

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

class GroundManagementConsumer(GenericAsyncAPIConsumer):
    serializer_class = GroundManagementSerializer
    permission_classes = [IsAuthenticated]

    @model_observer(GroundManagement)
    async def model_changed(self, message, observer=True, **kwargs):
        await self.send_json(message)

    @model_changed.serializer
    def model_serializer(self, instance, action, **kwargs):
        ground = GroundManagementSerializer(instance=instance).data
        return {'action': action.value, 'data': ground}

    async def connect(self, **kwargs):
        await super(GroundManagementConsumer, self).connect()
        await self.send_initial_json()
        await self.model_changed.subscribe()

    async def disconnect(self, code):
        await self.model_changed.unsubscribe()
        await super().disconnect(code)


    @database_sync_to_async
    def get_initial_data(self):
        return GroundManagementSerializer(GroundManagement.objects.all().order_by('-id'), many=True).data

    async def send_initial_json(self):
        initial_data = await self.get_initial_data()
        await self.send_json({
            'action':'initial',
            'data': initial_data,
        })


class GroundNewConsumer(GenericAsyncAPIConsumer):
    """
    Consumer for GroundNew model with real-time updates.
    """
    serializer_class = GroundNewSerializer
    permission_classes = [IsAuthenticated]

    @model_observer(GroundNew)
    async def model_changed(self, message, observer=None, **kwargs):
        """
        Handles model changes and sends serialized data via WebSocket.
        """
        await self.send_json(message)

    @model_changed.serializer
    def model_serializer(self, instance, action, **kwargs):
        """
        Serializes the model instance for the observer.
        """
        return {
            'action': action.value,
            'data': GroundNewSerializer(instance=instance).data
        }

    async def connect(self, **kwargs):
        """
        Handles WebSocket connection and sends initial data.
        """
        await super().connect()
        await self.send_initial_json()
        await self.model_changed.subscribe()

    async def disconnect(self, code):
        """
        Handles WebSocket disconnection and unsubscribes observers.
        """
        await self.model_changed.unsubscribe()
        await super().disconnect(code)

    @database_sync_to_async
    def fetch_initial_data(self):
        """
        Fetches initial data from the database.
        """
        return GroundNewSerializer(
            GroundNew.objects.all().order_by('-id'),
            many=True
        ).data

    async def send_initial_json(self):
        """
        Sends the initial data to the WebSocket client.
        """
        initial_data = await self.fetch_initial_data()
        await self.send_json({
            'action': 'initial',
            'data': initial_data
        })