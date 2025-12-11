// Lista centralizada de rutas expuestas por la API para asignar permisos
export type EndpointDefinition = {
  endpoint: string;
  descripcion: string;
};

export const ALL_ENDPOINTS: readonly EndpointDefinition[] = [
  // Auth
  {
    endpoint: '/auth/login',
    descripcion: 'Autenticacion mediante cedula y contrasena',
  },
  {
    endpoint: '/auth/register',
    descripcion: 'Registro de usuarios con cedula y correo',
  },
  {
    endpoint: '/auth/profile',
    descripcion: 'Consulta del perfil del usuario autenticado',
  },
  {
    endpoint: '/auth/gain-access',
    descripcion: 'Seleccion de perfil y emision de nuevo token JWT',
  },
  // Usuario y perfiles
  { endpoint: '/usuario', descripcion: 'Listado y gestion de usuarios' },
  {
    endpoint: '/usuario/perfil',
    descripcion: 'Asignacion de perfiles a usuarios',
  },
  { endpoint: '/perfil', descripcion: 'Creacion de perfiles y permisos' },
  {
    endpoint: '/perfil/:id',
    descripcion: 'Gestion de un perfil especifico',
  },
  // Localidades
  { endpoint: '/provincias', descripcion: 'Catalogo de provincias' },
  { endpoint: '/cantones', descripcion: 'Catalogo de cantones' },
  { endpoint: '/cai', descripcion: 'Consulta de centros de atencion' },
  // Parámetros
  { endpoint: '/parentesco', descripcion: 'Catalogo de parentescos' },
  { endpoint: '/etnia', descripcion: 'Catalogo de etnias' },
  { endpoint: '/nacionalidad', descripcion: 'Catalogo de nacionalidades' },
  { endpoint: '/estado-civil', descripcion: 'Catalogo de estados civiles' },
  { endpoint: '/gdos', descripcion: 'Catalogo de grados' },
  // Gestión de adolescentes
  { endpoint: '/adolescentes', descripcion: 'Gestion de adolescentes' },
  // Información de adolescentes
  { endpoint: '/ocupacion', descripcion: 'Catalogo de ocupaciones' },
  { endpoint: '/ocupacion/:id', descripcion: 'Detalle de ocupacion' },
  { endpoint: '/delito', descripcion: 'Catalogo de delitos' },
  { endpoint: '/delito/:id', descripcion: 'Detalle de delito' },
  { endpoint: '/juridico', descripcion: 'Registro juridico de adolescentes' },
  { endpoint: '/juridico/:id', descripcion: 'Detalle juridico especifico' },
] as const;

export type EndpointPath = (typeof ALL_ENDPOINTS)[number]['endpoint'];
