from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *
from django.utils import timezone


urlpatterns = [
    path('api/blog-details/', BlogDetailsListCreateAPIView.as_view(), name='blog-details-list-create'), # list all blogs 
    path('api/blog-details/<int:pk>/', BlogDetailsRetrieveAPIView.as_view(), name='blog-details-list-create'), # list all blogs 

    path('api/user-blog-crud/<int:pk>/', BlogDetailsRetrieveUpdateDestroyAPIView.as_view(), name='blog-details-retrieve-update-destroy'), # can delete,update only its own blog
    path('api/user-blog-list/', UserSpecificBlogDetailsListCreateAPIView.as_view(), name='blog-details-retrieve-update-destroy'), # can read  only its own blog
    
    path('api/total-blogs-count/', TotalBlogsCountAPIView.as_view(), name='total-blogs-count'),
    path('api/latest-blog/', LatestBlog.as_view(), name='latest-blog'),
    path('api/random-blogs/', LatestLimitBlog.as_view(), name='random-blogs'),
    path('api/random-recentBlogs/', LatestOpenRecentBlogs.as_view(), name='random-blogs'),
]
