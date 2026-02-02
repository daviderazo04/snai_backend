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
  {
    endpoint: '/usuario/perfil/:id',
    descripcion: 'Asignacion de perfil a un usuario especifico',
  },
  {
    endpoint: '/usuario/detalle/:id',
    descripcion: 'Detalle de un usuario con sus perfiles y permisos',
  },

  {
    endpoint: '/usuario/detalle',
    descripcion: 'Detalle de un usuario con sus perfiles y permisos',
  },
  {
    endpoint: '/endpoints',
    descripcion: 'Listado aplanado de endpoints disponibles',
  },
  { endpoint: '/perfil', descripcion: 'Creacion de perfiles y permisos' },
  {
    endpoint: '/perfil/:id',
    descripcion: 'Gestion de un perfil especifico',
  },
  {
    endpoint: '/perfil/detalle',
    descripcion: 'Consulta de permisos aplanados de un perfil',
  },
  {
    endpoint: '/perfil/detalle',
    descripcion: 'Consulta de permisos aplanados de un perfil',
  },
  // Localidades
  { endpoint: '/provincias', descripcion: 'Catalogo de provincias' },
  {
    endpoint: '/provincias/:id',
    descripcion: 'Gestion de una provincia especifica',
  },
  { endpoint: '/cantones', descripcion: 'Catalogo de cantones' },
  { endpoint: '/cantones/:id', descripcion: 'Gestion de un canton especifico' },
  { endpoint: '/cai', descripcion: 'Consulta de centros de atencion' },
  { endpoint: '/cai/:id', descripcion: 'Gestion de un CAI especifico' },
  {
    endpoint: '/traslados',
    descripcion: 'Gestion de traslados de adolescentes',
  },
  {
    endpoint: '/traslados/:id',
    descripcion: 'Gestion de un traslado especifico',
  },
  // Parámetros
  { endpoint: '/parentesco', descripcion: 'Catalogo de parentescos' },
  {
    endpoint: '/parentesco/:id',
    descripcion: 'Gestion de un parentesco especifico',
  },
  { endpoint: '/etnia', descripcion: 'Catalogo de etnias' },
  { endpoint: '/etnia/:id', descripcion: 'Gestion de una etnia especifica' },
  { endpoint: '/nacionalidad', descripcion: 'Catalogo de nacionalidades' },
  {
    endpoint: '/nacionalidad/:id',
    descripcion: 'Gestion de una nacionalidad especifica',
  },
  { endpoint: '/estado-civil', descripcion: 'Catalogo de estados civiles' },
  {
    endpoint: '/estado-civil/:id',
    descripcion: 'Gestion de un estado civil especifico',
  },
  { endpoint: '/gdos', descripcion: 'Catalogo de grados' },
  { endpoint: '/gdos/:id', descripcion: 'Gestion de un grado especifico' },
  // Gestión de adolescentes
  { endpoint: '/adolescentes', descripcion: 'Gestion de adolescentes' },
  {
    endpoint: '/adolescentes/:id',
    descripcion: 'Gestion de un adolescente especifico',
  },
  {
    endpoint: '/representantes',
    descripcion: 'Gestion de representantes de adolescentes',
  },
  {
    endpoint: '/representantes/:id',
    descripcion: 'Gestion de un representante especifico',
  },
  {
    endpoint: '/rep-infractores',
    descripcion: 'Gestion de relaciones representante-adolescente',
  },
  {
    endpoint: '/rep-infractores/:id',
    descripcion: 'Gestion de una relacion representante-adolescente',
  },
  // Información de adolescentes
  { endpoint: '/ocupacion', descripcion: 'Catalogo de ocupaciones' },
  { endpoint: '/ocupacion/:id', descripcion: 'Detalle de ocupacion' },
  { endpoint: '/delito', descripcion: 'Catalogo de delitos' },
  { endpoint: '/delito/:id', descripcion: 'Detalle de delito' },
  { endpoint: '/juridico', descripcion: 'Registro juridico de adolescentes' },
  { endpoint: '/juridico/:id', descripcion: 'Detalle juridico especifico' },
  { endpoint: '/salud', descripcion: 'Registro de salud de adolescentes' },
  { endpoint: '/salud/:id', descripcion: 'Detalle de salud especifico' },
  { endpoint: '/educacion', descripcion: 'Registro educativo de adolescentes' },
  { endpoint: '/educacion/:id', descripcion: 'Detalle educativo especifico' },
  { endpoint: '/evento', descripcion: 'Catalogo de eventos' },
  { endpoint: '/evento/:id', descripcion: 'Detalle de evento especifico' },
  { endpoint: '/familia', descripcion: 'Registro de interaccion familiar' },
  {
    endpoint: '/familia/:id',
    descripcion: 'Detalle de interaccion familiar especifica',
  },
  // Reportería
  {
    endpoint: '/reporteria/demografico/etnia',
    descripcion: 'Reporte demográfico por etnia',
  },
] as const;

export type EndpointPath = (typeof ALL_ENDPOINTS)[number]['endpoint'];
