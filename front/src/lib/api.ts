export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "/api";

export function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  const searchParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      searchParams.append(key, String(value));
    }
  }
  const query = Array.from(searchParams.keys()).length > 0 ? `?${searchParams.toString()}` : "";
  return `${API_BASE_URL}${path}${query}`;
}

export async function apiFetch<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return (await response.json()) as TResponse;
}


