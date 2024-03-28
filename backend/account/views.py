from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from .models import UserData, UserDetails
from .serializers import UserSerializer, UserDetailsSerializer, UserUpdateSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from account.utils import send_email_view, send_mail
from django.utils import timezone

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
    
    
    
class EmailCheckAPIView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the email exists in the database
        if UserData.objects.filter(email=email).exists():
            # Email exists in the database
            send_email_view(request, email)  # Call the send_email_view function with the email argument
            return Response({"message": "You will receive an email shortly."}, status=status.HTTP_200_OK)
        else:
            # Email does not exist in the database
            return Response({"message": "Email not found in the database."}, status=status.HTTP_404_NOT_FOUND)

class PasswordUpdateAPIView(APIView):
    def post(self, request):
        token = request.data.get('token', None)
        new_password = request.data.get('new_password', None)

        # Check if token and new password are provided
        if not token or not new_password:
            return Response({"error": "Token and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get UserDetails object for the given token
        try:
            user_details = UserDetails.objects.get(password_reset_token=token)
        except UserDetails.DoesNotExist:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the token is expired
        if user_details.password_reset_token_expire < timezone.now():
            return Response({"error": "Token has expired"}, status=status.HTTP_400_BAD_REQUEST)

        # Update user's password
        user = user_details.user
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
    