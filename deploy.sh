#!/bin/bash

# Detiene y elimina contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose -f docker-compose.yml -f docker-compose.override.yml down

# Construye las imágenes desde cero
echo "🔨 Construyendo imágenes..."
docker-compose -f docker-compose.yml -f docker-compose.override.yml build --no-cache

# Inicia los contenedores en modo detached
echo "🚀 Iniciando aplicación..."
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# Muestra los logs
echo "📜 Mostrando logs..."
docker-compose logs -f
