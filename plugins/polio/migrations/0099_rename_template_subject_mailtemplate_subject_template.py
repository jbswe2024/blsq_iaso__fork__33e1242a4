# Generated by Django 3.2.15 on 2022-10-10 13:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("polio", "0098_mailtemplate_text_template"),
    ]

    operations = [
        migrations.RenameField(
            model_name="mailtemplate",
            old_name="template_subject",
            new_name="subject_template",
        ),
    ]
