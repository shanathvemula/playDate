# Generated by Django 5.1.1 on 2024-11-18 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grounds', '0009_groundnew'),
    ]

    operations = [
        migrations.AddField(
            model_name='groundnew',
            name='availability_status',
            field=models.CharField(default='Available', max_length=250),
        ),
    ]