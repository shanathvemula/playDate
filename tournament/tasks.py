# teams/tasks.py
from celery import shared_task
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from app.views import send_mail
import os
from django.conf import settings
from datetime import datetime

User = get_user_model()

@shared_task
def create_user_and_send_email(team_member, team_name, owner_id):
    try:
        print("team_member", team_member)
        user = User.objects.create_user(
            username=team_member['email'],
            email=team_member['email'],
            password='Test@123',
            user_type='End User'
        )
        owner = User.objects.get(id=owner_id)
        # print(f"[DEBUG] Owner found: {owner.email}")

        context = {
            "logo_path": os.getenv('logoURL'),
            "app_name": os.getenv('app_name'),
            "first_name": team_member['name'],
            "email": team_member['email'],
            "logInURL": os.getenv("logInURL"),
            "current_year": datetime.now().year,
            "company_address": os.getenv("company_address"),
            "supportMail": os.getenv("supportMail"),
            "password": 'Test@123',
            "owner": owner.first_name,
            "team_name": team_name,
        }

        body = render_to_string("mail_templates/Team_invite_template.html", context)

        send_mail(
            to=team_member['email'],
            subject=f"Welcome to {os.getenv('app_name')}! Thank you for registering",
            body=body
        )

    except Exception as e:
        # Log error (optional)
        print(f"Failed to create user or send email for {team_member['email']}: {e}")
