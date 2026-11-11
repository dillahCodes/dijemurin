#!/bin/sh
set -e

if php artisan migrate --force; then
    echo "✅ Migrations up to date."
else
    echo "❌ CRITICAL: migrations failed. Container stays up for inspection." >&2
    echo "   Inspect with: php artisan migrate:status" >&2
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
