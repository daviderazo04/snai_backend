-- Datos iniciales para SNAI (solo inserts)
-- Este script asume que el esquema ya existe (TypeORM crea tablas).

-- Perfil ADMIN
INSERT INTO perfil (nombre, descripcion)
SELECT 'ADMIN', 'Perfil administrador con todos los permisos'
WHERE NOT EXISTS (SELECT 1 FROM perfil WHERE nombre = 'ADMIN');

-- Perfil USUARIO
INSERT INTO perfil (nombre, descripcion)
SELECT 'USUARIO', 'Perfil estándar de usuario'
WHERE NOT EXISTS (SELECT 1 FROM perfil WHERE nombre = 'USUARIO');

-- Endpoint '/auth/profile'
INSERT INTO endpoint (endpoint)
SELECT '/auth/profile'
WHERE NOT EXISTS (SELECT 1 FROM endpoint WHERE endpoint = '/auth/profile');

-- Usuario admin (password bcrypt de 'Admin123!')
INSERT INTO usuario (nombre, apellido, correo, password)
SELECT 'Admin', 'Root', 'nuevo.admin@correo.com', '$2b$10$pauitUxnrgZJP2SD6jFlRu6Doj10gqXT1qcM2aAmAz9LK4cdxpGMq'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo = 'nuevo.admin@correo.com');

-- Permisos para '/auth/profile'
-- ADMIN: VIEW=true, EDIT=true
INSERT INTO permiso ("endpointId", "perfilId", "VIEW", "EDIT")
SELECT e.id, p.id, TRUE, TRUE
FROM endpoint e
JOIN perfil p ON p.nombre = 'ADMIN'
WHERE e.endpoint = '/auth/profile'
  AND NOT EXISTS (
    SELECT 1 FROM permiso x WHERE x."endpointId" = e.id AND x."perfilId" = p.id
  );

-- USUARIO: VIEW=true, EDIT=false
INSERT INTO permiso ("endpointId", "perfilId", "VIEW", "EDIT")
SELECT e.id, p.id, FALSE, FALSE
FROM endpoint e
JOIN perfil p ON p.nombre = 'USUARIO'
WHERE e.endpoint = 'auth/profile'
  AND NOT EXISTS (
    SELECT 1 FROM permiso x WHERE x."endpointId" = e.id AND x."perfilId" = p.id
  );

-- Sesión del admin con perfil ADMIN (usa columnas por defecto de TypeORM: "perfilId" y "usuarioId")
WITH p AS (
  SELECT id FROM perfil WHERE nombre = 'ADMIN'
), u AS (
  SELECT id FROM usuario WHERE correo = 'nuevo.admin@correo.com'
)
INSERT INTO session ("perfilId", "usuarioId")
SELECT p.id, u.id FROM p, u
WHERE NOT EXISTS (
  SELECT 1 FROM session s WHERE s."perfilId" = (SELECT id FROM p) AND s."usuarioId" = (SELECT id FROM u)
);
