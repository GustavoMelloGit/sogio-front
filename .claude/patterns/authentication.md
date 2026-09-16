# Authentication

The session lives in an `httpOnly` cookie written by the API. The front never sees the secret: `document.cookie` cannot read it, and there is nothing in `localStorage`. Axios sends it automatically because the instance in `lib/api.ts` is created with `withCredentials: true`.

Two layers decide who sees what:

- **`src/proxy.ts`** runs on the server and only checks whether the cookie exists, redirecting before any HTML is sent — this is what keeps a logged-in visitor from seeing the landing page flash by. It never validates the session; the API does.
- **`ProtectedRoute` / `PublicRoute`** run in the browser and rely on `useAuthData()`, which asks `/auth/me`. A 401 there means anonymous, not an error.

`PublicRoute` only sends away a visitor who already had a session when the screen opened. When the screen itself authenticates (login, signup), the screen picks the destination and `PublicRoute` stays out of it: `setQueryData(['auth'])` reaches observers on a later tick, after the screen's `router.replace`, and a `redirect` from the guard at that point replaces the screen's navigation with its own.

## Rules

- Read the current user via `useAuth()` — it throws if the user is not logged in (safe inside `ProtectedRoute`)
- Read user + loading state via `useAuthData()` — use this at the app boundary where the user may not yet be loaded
- Never try to read the session cookie from JavaScript — it is `httpOnly` on purpose
- Never store the user or the session in `localStorage` — use the React Query cache via `useAuthData()`
- Log out with `useLogout()`, which calls `POST /auth/sign-out` so the session dies on the server too
- A public screen that signs the user in navigates on success by itself (`LoginView` → `returnPath(from)`); never rely on `PublicRoute` to move someone who just authenticated
- `NEXT_PUBLIC_SESSION_COOKIE_NAME` must match the name the API emits — `__Secure-sogio_session` in production, `sogio_session` locally
- A request that treats 401 as a normal answer (asking who the user is, checking a reset token) must pass `skipAuthRedirect: true`, or the global interceptor will bounce the browser to `/login`

## Do

```ts
// Inside a protected page or component
const user = useAuth(); // throws if unauthenticated — ProtectedRoute guarantees this won't throw
console.log(user.id, user.email);

// At the app boundary where user may still be loading
const { user, isLoading } = useAuthData();
if (isLoading) return <Spinner />;

// Logging out
const { logout } = useLogout();
await logout();
```

## Don't

```ts
// Wrong — the session is httpOnly; this is always null
const token = localStorage.getItem('auth_token');

// Wrong — storing auth data outside React Query
localStorage.setItem('user', JSON.stringify(userData));

// Wrong — checking auth manually instead of relying on proxy.ts + ProtectedRoute
const MyPage = () => {
  if (!document.cookie.includes('sogio_session')) redirect('/login');
};

// Wrong — clearing local state and calling it a logout; the session stays alive on the server
queryClient.setQueryData(['auth'], null);
```
