#!/bin/sh
set -e

if [ ! -d "node_modules" ]; then
    npm install
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
npm run dev &
