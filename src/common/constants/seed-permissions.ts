export const PARAMETROS_ENDPOINTS = [
  '/parentesco',
  '/etnia',
  '/nacionalidad',
  '/estado-civil',
  '/gdos',
] as const;

export const ADMIN_TICS_ENDPOINTS = [
  '/usuario',
  '/usuario/perfil',
  '/usuario/detalle',
  '/usuario/reactivar',
  '/usuario/informacion',
  '/usuario/password',
  '/endpoints',
  '/perfil',
  '/perfil/detalle',
  ...PARAMETROS_ENDPOINTS,
] as const;
