@echo off
setlocal enabledelayedexpansion

echo 🛑 Deteniendo contenedores existentes...
docker-compose -f docker-compose.yml -f docker-compose.override.yml down

echo 🧹 Limpiando imágenes no utilizadas...
docker image prune -f

echo 🔨 Construyendo imágenes sin usar caché...
docker-compose -f docker-compose.yml -f docker-compose.override.yml build --no-cache

echo 🚀 Iniciando aplicación en segundo plano...
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

echo 📜 Mostrando logs (Ctrl + C para salir)...
docker-compose logs -f
