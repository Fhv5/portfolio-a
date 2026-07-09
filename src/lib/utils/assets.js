/**
 * Retorna la URL del asset, concatenando el host de S3 si está definido.
 * Ideal para migrar imágenes a un CDN o Amazon S3 sin cambiar componentes.
 */
export function getAssetUrl(path) {
  const baseUrl = process.env.NEXT_PUBLIC_ASSETS_URL || "";
  // Evitar doble barra si la ruta ya empieza con '/' y baseUrl termina en '/'
  if (baseUrl.endsWith('/') && path.startsWith('/')) {
    return `${baseUrl}${path.substring(1)}`;
  }
  return `${baseUrl}${path}`;
}
