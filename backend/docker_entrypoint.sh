#!/bin/sh
set -ex

# Move to application directory
cd /app

# Ensure storage directories exist
mkdir -p storage/logs

# Wait for database to be ready
echo "Waiting for database..."
until python ./manage.py migrate; do
  echo "Database is not ready yet - sleeping..."
  sleep 2
done

# Load test fixture data only on initial run
if [ ! -f storage/firstrun ]; then
    python ./manage.py loaddata myapp_seeddata
    python ./manage.py loadfiles
    touch storage/firstrun
fi

# Create Admin User, ignore errors if it already exists
python ./manage.py createsuperuser --noinput || true

# Run Django’s development server
python ./manage.py runserver 0.0.0.0:8000