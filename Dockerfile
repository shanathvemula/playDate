# Use the official Python base image
FROM python:latest

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Ensures Python output is flushed
ENV PATH="/root/.local/bin:$PATH"

# Set the working directory
WORKDIR /usr/src/app

# Install system dependencies for GDAL and PostgreSQL
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set the GDAL library path
ENV GDAL_LIBRARY_PATH=/usr/lib/libgdal.so
ENV GEOS_LIBRARY_PATH=/usr/lib/libgeos_c.so

# Copy the requirements and environment file
COPY requirements.txt ./
COPY .env ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install psycopg2-binary --no-cache-dir --user

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 8000

# Run the Django server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
