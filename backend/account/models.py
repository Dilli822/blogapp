from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.text import slugify
from django.core.exceptions import ObjectDoesNotExist

class UserManager(BaseUserManager):
    use_in_migration = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is Required')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff = True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser = True')

        return self.create_user(email, password, **extra_fields)

class UserDetails(models.Model):
    user = models.OneToOneField('UserData', on_delete=models.CASCADE, related_name='user_details')
    address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    bio = models.TextField( blank=True)
    image = models.ImageField(upload_to='user_images/', null=True, blank=True)
    
    
    password_reset_token = models.CharField(max_length=100, blank=True, null=True)
    password_reset_token_generated_time = models.DateTimeField(blank=True, null=True) 
    password_reset_token_expire = models.DateTimeField(blank=True, null=True)

    @property
    def total_blogs(self):
        return self.user.blogs.count()

    def __str__(self):
        return f"Details for {self.user.username}"
    
class UserData(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    
    
    objects = UserManager()
    
    def delete(self, using=None, keep_parents=False):
        # Attempt to delete user_details, if it exists
        try:
            self.user_details.delete()
        except ObjectDoesNotExist:
            pass  # user_details does not exist, continue with deletion

        super().delete(using=using, keep_parents=keep_parents)
        
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username