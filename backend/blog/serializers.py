from rest_framework import serializers
from .models import BlogDetails


class BlogDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogDetails
        fields = ["id", 'title', 'description', 'image', 'date', 'created_at', 'updated_at', 'slug', 'username', 'user']
        