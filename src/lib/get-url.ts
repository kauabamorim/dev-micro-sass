export function geturl(path?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const normalizedPath =
    path && !path.startsWith("/") ? `/${path}` : path || null;

  return `${baseUrl}${normalizedPath}`;
}
