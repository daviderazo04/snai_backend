// Lista centralizada de rutas expuestas por la API para asignar permisos.
// Las rutas se almacenan normalizadas sin params dinámicos porque el guard las limpia (/:id -> /ruta).
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

  {
    endpoint: '/usuario/detalle',
    descripcion: 'Detalle de un usuario con sus perfiles y permisos',
  },
  {
    endpoint: '/usuario/reactivar',
    descripcion: 'Capacidad de reactivar usuarios',
  },
  {
    endpoint: '/usuario/informacion',
    descripcion: 'Actualizacion de informacion de usuario',
  },
  {
    endpoint: '/usuario/password',
    descripcion: 'Actualizacion de contrasena de usuario',
  },
  {
    endpoint: '/endpoints',
    descripcion: 'Listado aplanado de endpoints disponibles',
  },
  { endpoint: '/perfil', descripcion: 'Creacion de perfiles y permisos' },
  {
    endpoint: '/perfil/detalle',
    descripcion: 'Consulta de permisos aplanados de un perfil',
  },

  // Localidades
  { endpoint: '/provincias', descripcion: 'Catalogo de provincias' },
  { endpoint: '/cantones', descripcion: 'Catalogo de cantones' },
  { endpoint: '/cai', descripcion: 'Consulta de centros de atencion' },
  {
    endpoint: '/traslados',
    descripcion: 'Gestion de traslados de adolescentes',
  },
  // Parámetros
  { endpoint: '/parentesco', descripcion: 'Catalogo de parentescos' },
  { endpoint: '/etnia', descripcion: 'Catalogo de etnias' },
  { endpoint: '/nacionalidad', descripcion: 'Catalogo de nacionalidades' },
  { endpoint: '/estado-civil', descripcion: 'Catalogo de estados civiles' },
  { endpoint: '/gdos', descripcion: 'Catalogo de grados' },
  // Gestión de adolescentes
  { endpoint: '/adolescentes', descripcion: 'Gestion de adolescentes' },
  {
    endpoint: '/representantes',
    descripcion: 'Gestion de representantes de adolescentes',
  },
  {
    endpoint: '/rep-infractores',
    descripcion: 'Gestion de relaciones representante-adolescente',
  },
  // Información de adolescentes
  { endpoint: '/ocupacion', descripcion: 'Catalogo de ocupaciones' },
  { endpoint: '/delito', descripcion: 'Catalogo de delitos' },
  { endpoint: '/juridico', descripcion: 'Registro juridico de adolescentes' },
  { endpoint: '/salud', descripcion: 'Registro de salud de adolescentes' },
  { endpoint: '/educacion', descripcion: 'Registro educativo de adolescentes' },
  { endpoint: '/evento', descripcion: 'Catalogo de eventos' },
  { endpoint: '/familia', descripcion: 'Registro de interaccion familiar' },
  // Reportería
  {
    endpoint: '/reporteria/demografico/etnia',
    descripcion: 'Reporte demográfico por etnia',
  },
  {
    endpoint: '/reporteria/matriz/nacionalidad',
    descripcion: 'Matriz nacionalidad vs CAI',
  },
  {
    endpoint: '/reporteria/matriz/edad',
    descripcion: 'Matriz edad vs CAI',
  },
  {
    endpoint: '/reporteria/matriz/infraccion',
    descripcion: 'Matriz infracción vs CAI',
  },
  {
    endpoint: '/reporteria/matriz/medidas',
    descripcion: 'Matriz medidas vs CAI',
  },
] as const;

export type EndpointPath = (typeof ALL_ENDPOINTS)[number]['endpoint'];
