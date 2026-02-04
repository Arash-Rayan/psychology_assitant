from django.db import models


class AnalysisRecord(models.Model):
    patient_id = models.CharField(max_length=128)
    conversation_id = models.CharField(max_length=128)
    summary = models.TextField()
    score = models.IntegerField()
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chatbot_analysis"
        indexes = [
            models.Index(fields=["patient_id"]),
            models.Index(fields=["conversation_id"]),
        ]

    def __str__(self) -> str:
        return f"{self.patient_id} ({self.conversation_id})"

