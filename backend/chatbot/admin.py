from django.contrib import admin
from .models import AnalysisRecord


@admin.register(AnalysisRecord)
class AnalysisRecordAdmin(admin.ModelAdmin):
    list_display = ("patient_id", "conversation_id", "score", "created_at")
    search_fields = ("patient_id", "conversation_id")
    list_filter = ("created_at",)

