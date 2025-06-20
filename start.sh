#!/bin/bash

# Post Everywhere Server Startup Script

echo "🚀 Starting Post Everywhere Server..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it first."
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down..."
    docker-compose down
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the services
echo "📦 Starting services with Docker Compose..."
docker-compose up --build

# Wait for user to stop
echo "✅ Services started successfully!"
echo "🔗 Health check: http://localhost:3000/health"
echo "📊 API documentation: See README.md"
echo ""
echo "Press Ctrl+C to stop the services"
wait 