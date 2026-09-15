# HTTP Client

All HTTP requests go through the Axios instance in `lib/api.ts`. Never create a second Axios instance or use `fetch` directly.

## Rules

- Always import `api` from `@/lib/api` — never instantiate `axios.create()` elsewhere
- Never manually attach the `Authorization` header — the request interceptor handles it
- Never manually handle 401 — the response interceptor clears auth and redirects to `/login`
- Error messages are normalised by the response interceptor — read `error.message` directly

## How it works

```ts
// lib/api.ts (read-only reference — do not duplicate this)
const api = axios.create({ baseURL: env.NEXT_PUBLIC_API_URL, timeout: 10_000 });

// Request interceptor — attaches token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handles 401 globally
api.interceptors.response.use(null, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
  error.message = error.response?.data?.message ?? error.message;
  return Promise.reject(error);
});
```

## Do

```ts
// Service method — just use api directly
static async getPropertyById(id: string): Promise<Property> {
  const response = await api.get(`/property/${id}`);
  return propertySchema.parse(response.data);
}
```

## Don't

```ts
// Wrong — using fetch
static async getPropertyById(id: string) {
  const res = await fetch(`${BASE_URL}/property/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
  });
  return res.json();
}

// Wrong — creating a second axios instance
const myApi = axios.create({ baseURL: '...' });

// Wrong — manually handling 401 in a component
if (error.response?.status === 401) {
  router.push('/login');
}
```
