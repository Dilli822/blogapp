from rest_framework import serializers
from .models import BlogDetails


class BlogDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogDetails
        fields = ["id", 'title', 'description', 'image', 'date', 'created_at', 'updated_at', 'username', 'slug', 'user_id']
        

class TotalBlogsCountSerializer(serializers.Serializer):
    total_blogs_count = serializers.IntegerField()