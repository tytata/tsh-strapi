@echo off
echo Copying .env.production to .env
copy /Y .env.production .env

echo Building and starting production...
docker-compose up --build -d
