const ADMIN_API_URL = process.env.ADMIN_API_URL || 'http://localhost:4000/api/public';

export async function adminFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = `${ADMIN_API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return response;
}

export async function adminGet(path: string): Promise<Response> {
  return adminFetch(path, { method: 'GET' });
}

export async function adminPost(path: string, body: unknown): Promise<Response> {
  return adminFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
