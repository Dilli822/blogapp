from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name="sign_up"),
    path('api/usersList/', UserList.as_view(), name="get_users"),
    
    path('api/user/update/<int:pk>/', UserUpdate.as_view(), name="user_details_list"), #update the user username only 

    path('api/user/delete/<int:pk>/', UserDeleteAPIView.as_view(), name='user-delete'),  #delete the whole username account
    
    
    path('api/userdetails/', UserDetailsRetrieveUpdateView.as_view(), name='user_details_retrieve_update'), # read and update the userdetails 
    
    
    # password-reset
    path('password-reset-email/', EmailCheckAPIView.as_view(), name='send_email'),
    path('update-password/', PasswordUpdateAPIView.as_view(), name='password_update'),
    
] 