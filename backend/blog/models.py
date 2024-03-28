
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.text import slugify
import random
import string


class BlogDetails(models.Model):
    title = models.CharField(max_length=255,unique=False)
    description = models.TextField()
    image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    user = models.ForeignKey('account.UserData', on_delete=models.CASCADE, related_name='blogs')
    username = models.CharField(max_length=150, blank=True, null=True)
    
    # ... (other fields remain unchanged)

    def save(self, *args, **kwargs):
        # Auto-generate the slug when saving the blog post
        if not self.slug:
            base_slug = slugify(self.title)
            random_numerals = ''.join(random.choices(string.digits, k=1))  # Adjust the length as needed
            unique_slug = f"{base_slug}-{random_numerals}"
            counter = 1
            while BlogDetails.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{random_numerals}-{counter}"
                counter += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)