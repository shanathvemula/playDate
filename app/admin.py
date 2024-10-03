from django.contrib import admin

from app.models import User


# Register your models here.
# class UserAdmin(admin.ModelAdmin):
#     list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')


admin.site.unregister(User)

admin.site.register(User)
