const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1"
).replace(/\/api\/v1\/?$/, "");

/**
 * Resolve a backend-relative media path (e.g. "/uploads/123.jpg") into an
 * absolute URL the browser can load. Leaves already-absolute URLs untouched.
 */
export const resolveMediaUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path}`;
};
