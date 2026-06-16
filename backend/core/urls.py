from django.contrib import admin
from django.urls import path

from chatbot.views import chat, pre_consult_chat, chat_history, pre_consult_chat_history

urlpatterns = [
    path("admin/", admin.site.urls),
    path("chat/pre-consult/history", pre_consult_chat_history, name="pre_consult_chat_history"),
    path("chat/pre-consult", pre_consult_chat, name="pre_consult_chat"),
    path("chat/history", chat_history, name="chat_history"),
    path("chat", chat, name="chat"),
]

