# Generated by Django 3.2.14 on 2022-08-17 09:10

import django.contrib.postgres.fields
import django.contrib.postgres.fields.citext
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("iaso", "0155_alter_entitytype_unique_together"),
    ]

    operations = [
        migrations.AddField(
            model_name="entitytype",
            name="fields_detail_view",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=django.contrib.postgres.fields.citext.CITextField(blank=True, max_length=255),
                blank=True,
                null=True,
                size=100,
            ),
        ),
        migrations.AddField(
            model_name="entitytype",
            name="fields_list_view",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=django.contrib.postgres.fields.citext.CITextField(blank=True, max_length=255),
                blank=True,
                null=True,
                size=100,
            ),
        ),
        migrations.AlterField(
            model_name="entity",
            name="attributes",
            field=models.OneToOneField(
                blank=True,
                help_text="instance",
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="attributes",
                to="iaso.instance",
            ),
        ),
    ]
