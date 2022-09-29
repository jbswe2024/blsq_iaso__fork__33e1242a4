# Generated by Django 3.2.15 on 2022-09-15 13:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("polio", "0076_roundvaccine_shipment"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="roundvaccine",
            options={"ordering": ["name"]},
        ),
        migrations.AlterField(
            model_name="roundvaccine",
            name="round",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="vaccines",
                to="polio.round",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="roundvaccine",
            unique_together={("name", "round")},
        ),
    ]
