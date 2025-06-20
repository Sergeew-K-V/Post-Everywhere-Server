.PHONY: help install build start dev test lint format clean docker-up docker-down docker-build

# Default target
help:
	@echo "Available commands:"
	@echo "  install     - Install dependencies"
	@echo "  build       - Build the application"
	@echo "  start       - Start production server"
	@echo "  dev         - Start development server"
	@echo "  test        - Run tests"
	@echo "  lint        - Run ESLint"
	@echo "  format      - Format code with Prettier"
	@echo "  clean       - Clean build artifacts"
	@echo "  docker-up   - Start Docker services"
	@echo "  docker-down - Stop Docker services"
	@echo "  docker-build- Build Docker image"

# Install dependencies
install:
	npm install

# Build the application
build:
	npm run build

# Start production server
start:
	npm start

# Start development server
dev:
	npm run dev

# Run tests
test:
	npm test

# Run ESLint
lint:
	npm run lint

# Format code
format:
	npm run format

# Clean build artifacts
clean:
	rm -rf dist/
	rm -rf node_modules/

# Docker commands
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-build:
	docker-compose up --build -d

# Quick start (install + build + docker-up)
quick-start: install build docker-up
	@echo "🚀 Application started! Check http://localhost:3000/health" 