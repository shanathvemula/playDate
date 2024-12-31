from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.permissions import IsAuthenticated

from channels.db import database_sync_to_async

from payments.serializers import TransactionSerializer, Transaction

import json


class TransactionConsumer(GenericAsyncAPIConsumer):
    serializer_class = TransactionSerializer
    permission_classes = []

    @model_observer(Transaction)
    async def model_changed(self, message, observer=True, **kwargs):
        await self.send_json(message)

    @model_changed.serializer
    def model_serializer(self, instance, action, **kwargs):
        return {'action': action.value, 'data': TransactionSerializer(instance=instance).data}

    async def connect(self, **kwargs):
        await super(TransactionConsumer, self).connect()
        await self.model_changed.subscribe()

    async def disconnect(self, code):
        await self.model_changed.unsubscribe()
        await super().disconnect(code)