// Lista centralizada de rutas expuestas por la API para asignar permisos
export const ALL_ENDPOINTS = [
  // Auth
  '/auth/login',
  '/auth/register',
  '/auth/profile',
  '/auth/perfil',
  // Usuario y perfiles
  '/usuario',
  '/usuario/perfil',
  '/perfil',
  '/perfil/:id',
  // Localidades
  '/provincias',
  '/cantones',
  '/cai',
  // Parámetros
  '/parentesco',
  '/etnia',
  '/nacionalidad',
  '/estado-civil',
  '/gdos',
  // Gestión de adolescentes
  '/adolescentes',
  // Información de adolescentes
  '/ocupacion',
  '/ocupacion/:id',
  '/delito',
  '/delito/:id',
  '/juridico',
  '/juridico/:id',
] as const;

export type EndpointPath = (typeof ALL_ENDPOINTS)[number];
