from django.contrib import admin
from .models import Consultant,WeeklySlot


@admin.register(Consultant)
class ConsultantAdmin(admin.ModelAdmin):
    list_display = ["user", "years_of_experience", "qualification", "consultation_fee", "created_at"]
    search_fields = ["user__email", "qualification"]
    list_filter = ["years_of_experience"]




admin.site.register(WeeklySlot)
