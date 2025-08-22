@echo off
REM Script para iniciar el proyecto Learning Zone con Docker en Windows

echo 🚀 Iniciando Learning Zone con Docker...

REM Verificar si Docker está instalado
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker no está instalado. Por favor instala Docker primero.
    pause
    exit /b 1
)

REM Verificar si Docker Compose está instalado
where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker Compose no está instalado. Por favor instala Docker Compose primero.
    pause
    exit /b 1
)

REM Construir e iniciar los contenedores
echo 📦 Construyendo e iniciando contenedores...
docker-compose up --build -d

REM Esperar a que los servicios estén listos
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 30 /nobreak >nul

REM Verificar el estado de los contenedores
echo 📊 Estado de los contenedores:
docker-compose ps

echo ✅ Learning Zone está ejecutándose!
echo.
echo 🌐 URLs disponibles:
echo    Frontend: http://localhost
echo    Backend API: http://localhost:8000
echo    Backend Docs: http://localhost:8000/docs
echo    Chat Service: http://localhost:3001
echo    MySQL: localhost:3306
echo.
echo 🛠️  Comandos útiles:
echo    Ver logs: docker-compose logs -f [servicio]
echo    Detener: docker-compose down
echo    Reiniciar: docker-compose restart [servicio]

pause
