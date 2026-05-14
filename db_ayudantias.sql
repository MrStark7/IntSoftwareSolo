-- 1. Limpieza previa 
DROP TABLE IF EXISTS ayudantias_asignadas CASCADE;
DROP TABLE IF EXISTS postulaciones CASCADE;
DROP TABLE IF EXISTS ramos CASCADE;
DROP TABLE IF EXISTS alumnos CASCADE;
DROP TABLE IF EXISTS profesores CASCADE;
DROP TABLE IF EXISTS perfiles CASCADE;

-- 2. Creación de la Tabla de Perfiles (Usuarios centralizados)
CREATE TABLE perfiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo VARCHAR(150) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('admin', 'profesor', 'alumno')) DEFAULT 'alumno',
    correo VARCHAR(100) UNIQUE NOT NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Profesores
CREATE TABLE profesores (
    id_profesor SERIAL PRIMARY KEY,
    perfil_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
    departamento VARCHAR(100),
    especialidad VARCHAR(100)
);

-- 4. Tabla de Alumnos
CREATE TABLE alumnos (
    id_alumno SERIAL PRIMARY KEY,
    perfil_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
    carrera VARCHAR(100),
    promedio_general DECIMAL(3,2)
);

-- 5. Tabla de Asignaturas (Ramos)
CREATE TABLE ramos (
    id_ramo SERIAL PRIMARY KEY,
    nombre_ramo VARCHAR(100) NOT NULL,
    codigo_ramo VARCHAR(20) UNIQUE NOT NULL,
    id_profesor_titular INTEGER REFERENCES profesores(id_profesor),
    cupos_ayudantia INTEGER DEFAULT 1
);

-- 6. Tabla de Postulaciones (Relación N:M entre Alumnos y Ramos)
CREATE TABLE postulaciones (
    id_postulacion SERIAL PRIMARY KEY,
    id_alumno INTEGER REFERENCES alumnos(id_alumno) ON DELETE CASCADE,
    id_ramo INTEGER REFERENCES ramos(id_ramo) ON DELETE CASCADE,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'aceptado', 'rechazado')) DEFAULT 'pendiente',
    fecha_postulacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla de Ayudantías Activas (Asignación final)
CREATE TABLE ayudantias_asignadas (
    id_ayudantia SERIAL PRIMARY KEY,
    id_postulacion INTEGER REFERENCES postulaciones(id_postulacion) ON DELETE CASCADE,
    horario VARCHAR(100),
    sala VARCHAR(50)
);

-- Comentarios de documentación
COMMENT ON TABLE perfiles IS 'Tabla base que une a todos los usuarios del sistema';
COMMENT ON TABLE postulaciones IS 'Registro de solicitudes de alumnos para ser ayudantes';

