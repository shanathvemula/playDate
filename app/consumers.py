from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.permissions import IsAuthenticated

from channels.db import database_sync_to_async

from app.serializer import UserSerializer, User

import json


class UserConsumer(GenericAsyncAPIConsumer):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @model_observer(User)
    async def model_changed(self, message, observer=None, **kwargs):
        # Send model change event to client
        await self.send_json(message)

    @model_changed.serializer
    def model_serializer(self, instance, action, **kwargs):
        # Serialize user data asynchronously
        users = UserSerializer(instance=instance).data
        return {'action': action.value, 'data': users}

    async def connect(self, **kwargs):
        # Authenticate user before subscribing to the model observer
        await super(UserConsumer, self).connect()
        await self.send_initial_data()
        await self.model_changed.subscribe()

    async def disconnect(self, code):
        # Unsubscribe from the model observer when disconnecting
        await self.model_changed.unsubscribe()
        await super().disconnect(code)

    @database_sync_to_async
    def get_initial_data(self):
        # Fetch initial user data from the database
        return UserSerializer(User.objects.all(), many=True).data

    async def send_initial_data(self):
        # Send the initial user data after connection
        initial_data = await self.get_initial_data()
        await self.send_json({
            'action': 'initial',
            'data': initial_data
        })