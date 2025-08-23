# Backend Dockerfile - FastAPI + Python
FROM python:3.13-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    pkg-config \
    default-libmysqlclient-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Crear directorio para uploads si no existe
RUN mkdir -p uploads

# Exponer el puerto
EXPOSE 8000

# Variables de entorno por defecto
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Comando para ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
