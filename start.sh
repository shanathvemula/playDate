#!/bin/bash

# Start Celery in background
celery -A playDate worker --loglevel=info &

# Start Django dev server
