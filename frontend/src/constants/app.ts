/**
 * Nombre visible de la aplicación.
 * Fuente de verdad: variable de entorno VITE_APP_NAME en .env
 * Para cambiar el nombre en toda la aplicación, modificar únicamente ese valor.
 */
export const APP_NAME: string =
  import.meta.env.VITE_APP_NAME ?? 'Plataforma de Ayudantías UCN';
