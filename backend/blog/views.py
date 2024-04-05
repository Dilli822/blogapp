from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import BlogDetails
from .serializers import BlogDetailsSerializer, TotalBlogsCountSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models.functions import ExtractYear
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta

class BlogDetailsListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlogDetailsSerializer

    def get_queryset(self):
        # Exclude blogs of the authenticated user
        # return BlogDetails.objects.exclude(user=self.request.user)
        return BlogDetails.objects.filter(Q(user=self.request.user) | ~Q(user=self.request.user))

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BlogDetailsRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = BlogDetailsSerializer
    queryset = BlogDetails.objects.all()

    def get_object(self):
        # Retrieve a specific blog post by its ID
        obj = super().get_object()
        return obj
        

class UserSpecificBlogDetailsListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlogDetailsSerializer

    def get_queryset(self):
        # Return blogs of the authenticated user
        return BlogDetails.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
               
class BlogDetailsRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlogDetailsSerializer
    queryset = BlogDetails.objects.all()

    def get_queryset(self):
        return BlogDetails.objects.filter(user=self.request.user)
    
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Delete successful based on the post."},
                        status=status.HTTP_204_NO_CONTENT)
        
class TotalBlogsCountAPIView(generics.ListCreateAPIView):
    def get(self, request, *args, **kwargs):
        total_blogs_count = BlogDetails.objects.count()
        return Response({"total_blogs_count": total_blogs_count})
    
class LatestBlog(generics.ListCreateAPIView):
    serializer_class = BlogDetailsSerializer

    def get(self, request, *args, **kwargs):
        # Get the last blog post from the database
        last_blog = BlogDetails.objects.order_by('-id').first()

        if last_blog:
            serializer = self.serializer_class(last_blog)
            return Response(serializer.data)
        else:
            return Response({"detail": "No blog post found in the database."})
        
class LatestLimitBlog(generics.ListCreateAPIView):
    serializer_class = BlogDetailsSerializer

    def get(self, request, *args, **kwargs):
        # Get the current year
        current_year = timezone.now().year

        # Filter the latest four blogs for the current year
        latest_blogs = BlogDetails.objects.filter(date__year=current_year).order_by('-date')[:5]

        if latest_blogs:
            serializer = self.serializer_class(latest_blogs, many=True)
            return Response(serializer.data)
        else:
            return Response({"detail": f"No blog posts found for the year {current_year}."})
        
        
class LatestOpenRecentBlogs(generics.ListCreateAPIView):
    serializer_class = BlogDetailsSerializer

    def get(self, request, *args, **kwargs):
        # Calculate the date one month ago from today
        one_month_ago = timezone.now() - timedelta(days=30)
        
        # Filter blogs posted within the last month
        recent_blogs = BlogDetails.objects.filter(date__gte=one_month_ago).order_by('-date')[:6]

        if recent_blogs:
            serializer = self.serializer_class(recent_blogs, many=True)
            return Response(serializer.data)
        else:
            return Response({"detail": "No recent blog posts found."})
        
class TotalBlogsCountAPIView(generics.ListCreateAPIView):
    serializer_class = TotalBlogsCountSerializer  # Define the serializer class

    def get(self, request, *args, **kwargs):
        total_blogs_count = BlogDetails.objects.count()
        serializer = self.get_serializer({"total_blogs_count": total_blogs_count})
        return Response(serializer.data)