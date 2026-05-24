-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS db_municipalidad;
USE db_municipalidad;

-- Tabla de Ciudadanos
CREATE TABLE ciudadanos (
    dni VARCHAR(8) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100)
);

-- Tabla de Áreas de la Municipalidad
CREATE TABLE areas (
    id_area INT AUTO_INCREMENT PRIMARY KEY,
    nombre_area VARCHAR(100) NOT NULL
);

-- Tabla principal de Trámites (La que consumirá la IA)
CREATE TABLE tramites (
    id_tramite INT AUTO_INCREMENT PRIMARY KEY,
    dni_ciudadano VARCHAR(8) NOT NULL,
    tipo_tramite VARCHAR(100) NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    prioridad_ia VARCHAR(20) DEFAULT 'Pendiente Evaluar', -- Aquí guardaremos el resultado del modelo
    estado VARCHAR(50) DEFAULT 'Registrado',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dni_ciudadano) REFERENCES ciudadanos(dni)
);

-- Insertar algunas áreas de prueba
INSERT INTO areas (nombre_area) VALUES ('Mesa de Partes'), ('Obras Públicas'), ('Rentas');