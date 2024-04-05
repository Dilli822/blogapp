import secrets
from django.core.mail import send_mail, EmailMultiAlternatives
from .models import UserDetails, UserData
from django.utils import timezone
from datetime import timedelta


def generate_random_token(length=16):
    # Generate a random token with the specified length
    return secrets.token_urlsafe(length)


def send_email_view(request, email):
    # Generate a random token for password reset link
    token = generate_random_token()

    # Construct the password reset link
    reset_link = f'http://localhost:3000/blog-app/reset-password/{token}/confirm/'

    # Save the token in the database and set its expiration time
    user_data = UserData.objects.get(email=email)
    user_details, _ = UserDetails.objects.get_or_create(user=user_data)
    user_details.password_reset_token = token
    user_details.password_reset_token_generated_time = timezone.now()
    user_details.password_reset_token_expire = timezone.now() + timedelta(minutes=5)
    user_details.save()

    # Compose email message
    subject = 'Password Reset Link From Blog App'

    # Compose email message using HTML template
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Link</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #fff; border-radius: 5px; padding: 20px;">
            <h2 style="color: #333;">Password Reset Link</h2>
            <p style="color: #666;">Token will expire in 2 minutes.</p>
            <p style="color: #666;">Click on the link below to reset your password:</p>
            <a href="{reset_link}" style="color: #007bff; text-decoration: none;">Reset Password</a>
        </div>
    </body>
    </html>
    """

    # Create EmailMultiAlternatives object and attach the HTML content
    msg = EmailMultiAlternatives(subject, '', 'testingbot202424@gmail.com', [email])
    msg.attach_alternative(html_content, "text/html")

    # Send the email
    msg.send()

    return token