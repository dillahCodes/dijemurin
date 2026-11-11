# ==========================================
# 1. BASE STAGE
# ==========================================
FROM serversideup/php:8.5-fpm-nginx-alpine AS base

ENV HTTP_PORT=8080

WORKDIR /var/www/html

# ==========================================
# 2. BACKEND DEPENDENCIES (LARAVEL VENDOR)
# ==========================================
FROM composer:2 AS composer-deps-dev

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-interaction --no-scripts \
    --no-autoloader --ignore-platform-reqs --prefer-dist

FROM composer:2 AS composer-deps-prod

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install --no-dev \
    --no-interaction --no-scripts \
    --no-autoloader --ignore-platform-reqs --prefer-dist

# ==========================================
# 3. FRONTEND DEPENDENCIES (REACT NODE MODULES)
# ==========================================
FROM node:22-alpine AS node-deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

# ==========================================
# 4. DEVELOPMENT STAGE
# ==========================================
FROM base AS dev

USER root

# Copy Node.js 22 binaries & install C++ stdlib runtime
RUN apk update && apk add --no-cache libstdc++
COPY --from=node-deps /usr/local/bin /usr/local/bin
COPY --from=node-deps /usr/local/lib/node_modules /usr/local/lib/node_modules

COPY . /var/www/html

# Copy Composer vendor and Node modules from dependency stages
COPY --from=composer-deps-dev /app/vendor /var/www/html/vendor
COPY --from=node-deps /app/node_modules /var/www/html/node_modules

# Generate autoloader for application classes
RUN composer dump-autoload --optimize

# Copy development entrypoint script
COPY docker/entrypoint-dev.sh /etc/entrypoint.d/99-dev.sh
RUN chmod +x /etc/entrypoint.d/99-dev.sh

# Set UID/GID and fix file permissions for www-data
ARG USER_ID=1000
ARG GROUP_ID=1000
RUN docker-php-serversideup-set-id www-data $USER_ID:$GROUP_ID \
    && docker-php-serversideup-set-file-permissions --owner $USER_ID:$GROUP_ID

USER www-data
EXPOSE 8000 5173

# ==========================================
# 5. BUILD STAGE (REACT ASSETS)
# ==========================================
FROM base AS node-builder

USER root

# Copy Node.js 22 binaries & install C++ stdlib runtime
RUN apk update && apk add --no-cache libstdc++
COPY --from=node-deps /usr/local/bin /usr/local/bin
COPY --from=node-deps /usr/local/lib/node_modules /usr/local/lib/node_modules

COPY . /var/www/html

# Copy Composer vendor and Node modules
COPY --from=composer-deps-dev /app/vendor /var/www/html/vendor
COPY --from=node-deps /app/node_modules /var/www/html/node_modules

# Re-generate autoloader map for Wayfinder route generator
RUN composer dump-autoload --optimize

RUN npm run build

# ==========================================
# 6. PRODUCTION STAGE (MINIMAL)
# ==========================================
FROM base AS prod

ENV PHP_OPCACHE_ENABLE=1

USER root

COPY --chown=www-data:www-data . /var/www/html

# Remove raw frontend source files and dev configs
RUN rm -rf /var/www/html/resources/js /var/www/html/resources/css \
    /var/www/html/vite.config.ts /var/www/html/tsconfig.json

# Copy production vendor and compiled frontend assets
COPY --from=composer-deps-prod --chown=www-data:www-data /app/vendor /var/www/html/vendor
COPY --from=node-builder --chown=www-data:www-data /var/www/html/public/build /var/www/html/public/build

# Generate final optimized autoloader map for production
RUN composer dump-autoload --optimize --no-dev --no-scripts

# Copy production entrypoint script
COPY docker/entrypoint-prod.sh /etc/entrypoint.d/99-prod.sh
RUN chmod +x /etc/entrypoint.d/99-prod.sh

# Set file permissions for www-data user
RUN docker-php-serversideup-set-file-permissions --owner www-data:www-data

USER www-data
EXPOSE 8080