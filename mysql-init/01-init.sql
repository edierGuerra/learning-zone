-- Inicialización de la base de datos Learning Zone
-- Este script se ejecuta automáticamente al crear el contenedor MySQL

USE learning_zone_db;

-- Crear tablas básicas si no existen (FastAPI las creará automáticamente)
-- Este archivo puede contener datos iniciales si es necesario

-- Configurar zona horaria
SET time_zone = '+00:00';

-- Configurar charset
ALTER DATABASE learning_zone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
