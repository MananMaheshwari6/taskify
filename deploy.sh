#!/bin/bash

# Deployment script for Taskify application
set -e

echo "🚀 Starting Taskify deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it first."
    exit 1
fi

# Create application directory if it doesn't exist
APP_DIR="/home/ubuntu/taskify"
mkdir -p $APP_DIR
cd $APP_DIR

echo "📦 Pulling latest images..."
docker-compose pull

echo "🛑 Stopping existing containers..."
docker-compose down

echo "🧹 Cleaning up old images..."
docker image prune -f

echo "🔧 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be healthy..."
timeout 300 bash -c '
    while true; do
        if docker-compose ps | grep -q "healthy"; then
            echo "✅ All services are healthy!"
            break
        fi
        echo "⏳ Waiting for services to be ready..."
        sleep 10
    done
'

echo "🔍 Checking service status..."
docker-compose ps

echo "✅ Deployment completed successfully!"
echo "🌐 Application is available at:"
echo "   Frontend: http://$(curl -s ifconfig.me):3000"
echo "   Backend API: http://$(curl -s ifconfig.me):4002"
echo "   Health Check: http://$(curl -s ifconfig.me):4002/health" 