from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.postgres.fields import ArrayField

# Phone Number Field
from phonenumber_field.modelfields import PhoneNumberField

# For Auth User
from django.contrib.auth.models import User

GENDER_CHOICES = (("Male", "Male"), ("Female", "Female"), ("Other", "Other"))
User.add_to_class('dob', models.DateField(blank=True, null=True))
User.add_to_class('gender', models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True))
User.add_to_class('age', models.IntegerField(validators=[MinValueValidator(10), MaxValueValidator(100)], default=0))
User.add_to_class('phone', PhoneNumberField(region='IN', blank=True, null=True))
User.add_to_class('alternate_phone', PhoneNumberField(region='IN', blank=True, null=True))
User.add_to_class('photo', models.ImageField(blank=True, null=True))
User.add_to_class('address', models.JSONField(default=dict, blank=True, null=True))
User.add_to_class('skills', models.JSONField(default=dict, blank=True, null=True))
User.add_to_class('json', models.JSONField(default=dict, blank=True, null=True))


# from mongoengine import Document, StringField, IntField
#
#
# # Create your models here.
# class User(Document):
#     age = IntField(required=True)
#
#     meta = {
#         'collection': 'users'
#     }

class SiteManagement(models.Model):
    name = models.CharField(max_length=50, unique=True)
    copyright = models.CharField(max_length=50)
    logo = models.ImageField(blank=True, null=True)
    slideshow = ArrayField(
        models.JSONField(),
        size=10, blank=True, null=True
    )
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'site_management'