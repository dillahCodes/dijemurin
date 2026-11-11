#!/bin/sh
set -e
php artisan migrate --force || echo "WARNING: migration failed, check 'php artisan migrate:status'"

# clear and regenerate cache
php artisan optimize:clear
php artisan package:discover --ansi

if [ ! -d "node_modules" ]; then
    npm install
fi

npm run dev &
