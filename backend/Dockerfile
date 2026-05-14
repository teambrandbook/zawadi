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

# Collect static files (SECRET_KEY only needed at runtime, not for collectstatic)
RUN SECRET_KEY=build-placeholder DEBUG=True python manage.py collectstatic --noinput

EXPOSE 8000

RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# Run migrations then start gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn zewadi.wsgi:application --bind 0.0.0.0:8000 --workers 4 --timeout 120 --max-requests 1000 --max-requests-jitter 100 --access-logfile - --error-logfile -"]
