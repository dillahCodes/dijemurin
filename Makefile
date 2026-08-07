.PHONY: setup dev dev-down build push pull start prod-down show

# ==========================================
# DEVELOPMENT
# ==========================================

# Start development environment
dev:
	@echo "Starting Development environment..."
	docker compose --profile dev up -d --build

# Initialize development database
setup:
	@echo "Starting Development environment..."
	docker compose --profile dev up -d --build

	@echo "Running Laravel migrations and seeders..."
	docker exec -it dijemurin-dev php artisan migrate:fresh --seed

# Stop development environment
dev-down:
	@echo "Stopping Development environment..."
	docker compose --profile dev down

# ==========================================
# CI/CD - BUILD & RELEASE
# ==========================================

# Build production image
build:
	@echo "Building production image..."
	docker build --target prod -t $(USERNAME)/dijemurin:$(TAG) .

# Push image to Docker Hub
push:
	@echo "Pushing image to Docker Hub..."
	docker push $(USERNAME)/dijemurin:$(TAG)

# ==========================================
# PRODUCTION DEPLOYMENT
# ==========================================

# Pull latest image (server: no build, only pull & run)
pull:
	@echo "Pulling image..."
	docker pull $(USERNAME)/dijemurin:$(TAG)

# Start production application
start:
	@echo "Starting Production environment..."
	docker compose --profile prod up -d

# Show Production containers
show:
	@echo "Showing Production containers..."
	docker ps -s --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Size}}"

# Stop production application
prod-down:
	@echo "Stopping Production environment..."
	docker compose --profile prod down