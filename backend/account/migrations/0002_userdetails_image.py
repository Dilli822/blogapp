# Generated by Django 5.0.1 on 2024-01-21 16:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdetails',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='user_images/'),
        ),
    ]
