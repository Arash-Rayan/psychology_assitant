from django.contrib import admin
from django.urls import path

from chatbot.views import chat, pre_consult_chat

urlpatterns = [
    path("admin/", admin.site.urls),
    path("chat/pre-consult", pre_consult_chat, name="pre_consult_chat"),
    path("chat", chat, name="chat"),
]

