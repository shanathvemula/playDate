#!/bin/bash

# Start Celery in background
celery -A playDate worker --loglevel=info &

# Start Django dev server
python3 manage.py runserver 0.0.0.0:8000