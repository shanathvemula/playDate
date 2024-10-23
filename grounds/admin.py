from django.contrib import admin

# Register your models here.
from grounds.models import Grounds, Arena

admin.site.register(Grounds)
admin.site.register(Arena)