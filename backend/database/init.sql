-- Inicialización de base de datos para Learning Zone en DigitalOcean
-- Este script se ejecuta automáticamente cuando se crea la base de datos

-- Configurar charset para soporte completo de UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Crear usuario de aplicación si no existe (opcional, DigitalOcean maneja esto)
-- CREATE USER IF NOT EXISTS 'learning_zone_app'@'%' IDENTIFIED BY 'secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON learning_zone.* TO 'learning_zone_app'@'%';

-- Configuraciones de sesión recomendadas
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- Configurar timezone (opcional)
-- SET time_zone = '+00:00';

-- Mensaje de confirmación
SELECT 'Learning Zone Database Initialized Successfully' AS status;
