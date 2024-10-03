# app/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from app.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@receiver(post_save, sender=User)
def send_real_time_data(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'user_{instance.user.id}',  # This should be the user's channel group
        {
            'type': 'send_real_time_data',  # Custom function in the consumer
            'message': f'Updated data for {instance.user.username}'
        }
    )
