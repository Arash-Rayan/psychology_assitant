from django.contrib import admin
from django.urls import path

from chatbot.views import (
    chat,
    pre_consult_chat,
    chat_history,
    pre_consult_chat_history,
    pre_consult_session_detail,
    stt_transcribe,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "chat/pre-consult/session/<int:session_id>",
        pre_consult_session_detail,
        name="pre_consult_session_detail",
    ),
    path("chat/pre-consult/history", pre_consult_chat_history, name="pre_consult_chat_history"),
    path("chat/pre-consult", pre_consult_chat, name="pre_consult_chat"),
    path("chat/history", chat_history, name="chat_history"),
    path("chat", chat, name="chat"),
    path("stt/transcribe", stt_transcribe, name="stt_transcribe"),
]
