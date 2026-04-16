from django.contrib import admin
from .models import CommunityUser,CommunityUserAddress
# Register your models here.
admin.site.register(CommunityUser)
admin.site.register(CommunityUserAddress)