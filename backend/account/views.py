from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from .models import UserData, UserDetails
from .serializers import UserSerializer, UserDetailsSerializer, UserUpdateSerializer
from django.shortcuts import get_object_or_404


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UserDetailsListAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailsSerializer

    def get_queryset(self):
        return UserDetails.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        

class UserList(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_queryset(self):
        return UserData.objects.filter(id=self.request.user.id)

    def perform_create(self, serializer):
        serializer.save()

class UserUpdate(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserUpdateSerializer  # Use the new serializer for update operations

    def get_queryset(self):
        return UserData.objects.filter(id=self.request.user.id)

class UserDetailsDetailAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailsSerializer
    queryset = UserDetails.objects.all()

    def get_queryset(self):
        return UserDetails.objects.filter(user=self.request.user)


class UserDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()  # This will delete the user and cascade to related models

        return Response({"message": "Account deleted successfully."})
    
    
class UserDetailsRetrieveUpdateView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailsSerializer

    def get_object(self):
        # Retrieve UserDetails for the authenticated user
        user = self.request.user
        obj, created = UserDetails.objects.get_or_create(user=user)
        return obj

    def update(self, request, *args, **kwargs):
        # Ensure the user field is set to the authenticated user
        request.data['user'] = self.request.user.id

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)