/**
 * API configuration and base URL resolution.
 * Normalizes input so missing protocols (https://) or trailing slashes
 * configured in Vercel or environment variables do not cause relative URL routing bugs.
 */

export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  let url = (envUrl && typeof envUrl === "string") ? envUrl.trim() : "";

  if (!url) {
    return "https://doc-flow-backend-master-production-4302.up.railway.app/api";
  }

  // Prepend https:// if protocol is omitted
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  // Strip trailing slashes
  url = url.replace(/\/+$/, "");

  // Ensure /api suffix
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }

  return url;
}

export const API_BASE_URL = getApiBaseUrl();
