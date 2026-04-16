FROM python:3.12-slim

# System dependencies for Pillow + psycopg2
RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    zlib1g-dev \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (layer cache)
COPY zewadi/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project
COPY zewadi/ .

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Run migrations then start gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn zewadi.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120"]
