from django.db import models


class ChatSession(models.Model):
    user_name = models.CharField(max_length=100)
    initial_mood = models.CharField(max_length=50, blank=True, null=True)
    consultation_subject = models.CharField(max_length=20, blank=True, null=True)
    pre_consult_completed_at = models.DateTimeField(blank=True, null=True)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(blank=True, null=True)
    total_tokens = models.IntegerField(default=0)

    class Meta:
        db_table = "chat_sessions"
        ordering = ["-started_at"]


class ChatMessage(models.Model):
    ROLE_USER = "user"
    ROLE_ASSISTANT = "assistant"
    ROLE_SYSTEM = "system"
    ROLE_CHOICES = [
        (ROLE_USER, "User"),
        (ROLE_ASSISTANT, "Assistant"),
        (ROLE_SYSTEM, "System"),
    ]

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    seq = models.IntegerField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    token_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chat_messages"
        ordering = ["session_id", "seq"]
        constraints = [
            models.UniqueConstraint(
                fields=["session", "seq"], name="uniq_chat_message_seq_per_session"
            )
        ]
