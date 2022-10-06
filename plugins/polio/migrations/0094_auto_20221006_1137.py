# Generated by Django 3.2.15 on 2022-10-06 11:37

from django.db import migrations, models
import plugins.polio.budget.models


class Migration(migrations.Migration):

    dependencies = [
        ("polio", "0093_alter_mailtemplate_template"),
    ]

    operations = [
        migrations.AddField(
            model_name="mailtemplate",
            name="template_subject",
            field=models.TextField(
                default="Budget validation",
                help_text="Template for the Email subject, use the Django Template language, see https://docs.djangoproject.com/en/4.1/ref/templates/language/ for reference. Please keep it as one line.",
                validators=[plugins.polio.budget.models.validator_template],
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="mailtemplate",
            name="template",
            field=models.TextField(
                help_text="Template for the Email body, use the Django Template language, see https://docs.djangoproject.com/en/4.1/ref/templates/language/ for reference",
                validators=[plugins.polio.budget.models.validator_template],
            ),
        ),
    ]
