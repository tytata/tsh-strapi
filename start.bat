@echo off
echo Copying .env.docker to .env
copy /Y .env.docker .env

echo Starting Strapi in DEV mode...
docker-compose up --build
