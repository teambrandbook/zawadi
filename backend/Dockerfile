FROM python:3.12-slim

# System dependencies + non-root user in one layer
RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    zlib1g-dev \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/* \
    && adduser --disabled-password --gecos "" appuser

WORKDIR /app

# Install Python dependencies first (layer cache)
COPY zewadi/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

ARG BACKEND_SOURCE_CACHE_BUST=2026-05-15-settings-py
RUN echo "$BACKEND_SOURCE_CACHE_BUST" > /tmp/backend-source-cache-bust

# Copy Django project with correct ownership — no chown layer needed
COPY --chown=appuser:appuser zewadi/ .
RUN python -m py_compile zewadi/settings.py

# Collect static files (runs as root; staticfiles/ is world-readable)
RUN SECRET_KEY=build-placeholder DEBUG=True python manage.py collectstatic --noinput

EXPOSE 8000

USER appuser

# Run migrations then start gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn zewadi.wsgi:application --bind 0.0.0.0:8000 --workers 4 --timeout 120 --max-requests 1000 --max-requests-jitter 100 --access-logfile - --error-logfile -"]
