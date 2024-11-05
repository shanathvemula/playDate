from django.contrib import admin

# Register your models here.
from grounds.models import Grounds, GroundManagement # , Arena

admin.site.register(Grounds)
admin.site.register(GroundManagement)
# admin.site.register(Arena)