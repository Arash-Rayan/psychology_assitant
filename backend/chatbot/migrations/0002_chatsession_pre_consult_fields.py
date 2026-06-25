from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chatbot", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="chatsession",
            name="consultation_subject",
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name="chatsession",
            name="pre_consult_completed_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
