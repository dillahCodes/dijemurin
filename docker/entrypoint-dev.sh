#!/bin/sh
set -e

# clear and regenerate cache
php artisan optimize:clear
php artisan package:discover --ansi

if [ ! -d "node_modules" ]; then
    npm install
fi

php artisan migrate --force
npm run dev &
