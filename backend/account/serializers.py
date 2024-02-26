from rest_framework import serializers
from .models import UserData, UserDetails

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserData
        fields = ('id', 'email', 'username', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = UserData.objects.create(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data.get('first_name', ''),  # Include first_name if provided
            last_name=validated_data.get('last_name', ''),    # Include last_name if provided
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    
class UserDetailsSerializer(serializers.ModelSerializer):
    total_blogs = serializers.SerializerMethodField()

    class Meta:
        model = UserDetails
        fields = ["user_id", 'address', 'phone_number', 'bio', 'total_blogs', "image"]

    def get_total_blogs(self, obj):
        return obj.user.blogs.count()


# update only the defined fields in the serializer for now only the username
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ['username']