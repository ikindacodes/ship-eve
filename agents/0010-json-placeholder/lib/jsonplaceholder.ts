export const BASE_URL = "https://jsonplaceholder.typicode.com";

export type ResourceName =
  | "posts"
  | "comments"
  | "albums"
  | "photos"
  | "todos"
  | "users";

type QueryParams = Record<string, string | number | boolean>;

function buildUrl(path: string, query?: QueryParams): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(normalized, `${BASE_URL}/`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export type JsonPlaceholderResult<T> = {
  ok: boolean;
  status: number;
  data: T;
};

export async function jsonPlaceholderRequest<T = unknown>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    query?: QueryParams;
  } = {},
): Promise<JsonPlaceholderResult<T>> {
  const { method = "GET", body, query } = options;
  const response = await fetch(buildUrl(path, query), {
    method,
    headers:
      body !== undefined
        ? { "Content-Type": "application/json; charset=UTF-8" }
        : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = (text ? JSON.parse(text) : {}) as T;

  return { ok: response.ok, status: response.status, data };
}

export function listResource<T = unknown>(
  resource: ResourceName,
  query?: QueryParams,
) {
  return jsonPlaceholderRequest<T[]>(`/${resource}`, { query });
}

export function getResource<T = unknown>(resource: ResourceName, id: number) {
  return jsonPlaceholderRequest<T>(`/${resource}/${id}`);
}

export function createResource<T = unknown>(
  resource: ResourceName,
  body: unknown,
) {
  return jsonPlaceholderRequest<T>(`/${resource}`, { method: "POST", body });
}

export function updateResource<T = unknown>(
  resource: ResourceName,
  id: number,
  body: unknown,
) {
  return jsonPlaceholderRequest<T>(`/${resource}/${id}`, {
    method: "PUT",
    body,
  });
}

export function patchResource<T = unknown>(
  resource: ResourceName,
  id: number,
  body: Record<string, unknown>,
) {
  return jsonPlaceholderRequest<T>(`/${resource}/${id}`, {
    method: "PATCH",
    body,
  });
}

export function deleteResource(resource: ResourceName, id: number) {
  return jsonPlaceholderRequest<Record<string, never>>(`/${resource}/${id}`, {
    method: "DELETE",
  });
}

export function listNestedResource<T = unknown>(
  parent: ResourceName,
  parentId: number,
  child: ResourceName,
) {
  return jsonPlaceholderRequest<T[]>(`/${parent}/${parentId}/${child}`);
}
