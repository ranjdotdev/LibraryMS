# LibraryMS — Frontend

## Technical Project Overview

## Core Architecture

The frontend is a React + Vite SPA written in TypeScript. All server state is managed by TanStack Query — there is no Redux, no Zustand, no ad-hoc `useEffect` fetching. Component state handles UI concerns (open/closed, current page, search input); query state handles everything that comes from the server.

The folder structure is feature-based rather than type-based:

```
src/
├── api/           axios client + ApiError type
├── components/
│   ├── core/      shadcn/ui primitives (untouched)
│   └── blocks/    custom composite components
├── env.ts         validated environment variables
├── features/      books · auth · categories · borrowings · users
├── hooks/         shared custom hooks
├── layouts/       authenticated shell layout
├── lib/           query client · auth cache · shared types
├── providers/     React context providers
└── routes/        page components (one file per route)
```

Each feature owns its `api.ts` (typed Axios calls), `types.ts` (DTOs that mirror the backend contracts), `schemas.ts` (Zod validation schemas), and a `components/` folder for UI that belongs only to that feature. Route pages in `src/routes/` import from features and compose them — the routes themselves contain no data-fetching logic.

## Auth State & localStorage Cache

The auth flow is designed so that a returning user never sees a loading flash before the page renders. The approach uses two layers:

**Layer 1 — synchronous initialisation from localStorage.** `AuthProvider` initialises its `user` state with a lazy initialiser that reads from `localStorage` before the first render:

```ts
const [user, setUser] = useState<AuthUser | null>(() => readCachedUser())
```

Because React evaluates the lazy initialiser synchronously during the first render, the user object is available immediately — before any network request has been made. Route guards, the layout, and the navigation all see a valid user on the very first paint.

**Layer 2 — background validation via TanStack Query.** In parallel, a `useQuery` for `/api/auth/me` is fired automatically whenever `user !== null`. When it resolves, the fresh data from the server overwrites both the React state and the localStorage entry, keeping the cache in sync. The query has a 15-minute `staleTime`, so navigating between pages does not re-hit the endpoint unnecessarily.

The result: for an authenticated user the page renders immediately with the cached context, and the server silently confirms (or corrects) that context in the background. For an unauthenticated user, `readCachedUser()` returns `null`, the query is not fired, and the route guards redirect to login — also on the first render, no flicker.

## Forced Logout

The Axios response interceptor detects any 401 and dispatches a `window.dispatchEvent(new Event("auth:logout"))` DOM event. `AuthProvider` registers a listener for this event and handles the logout — clearing the cache, resetting React Query state, and navigating to `/login`. This decoupling is deliberate: interceptors run outside the React tree and cannot call hooks or `navigate()` directly. The event bus bridges the two worlds cleanly.

## Validation

Forms use React Hook Form with Zod resolvers. Validation schemas live in `schemas.ts` per feature, and the inferred types from those schemas are used directly as form value types — no duplication between the schema and the type definition. Errors are surfaced through shadcn's `Form` primitive which wires the form context to accessible error messages automatically.

## Environment Variables

`env.ts` validates all `VITE_*` variables against a Zod schema at startup. If any variable is missing or malformed, the app throws immediately with a descriptive error listing every failing key — rather than propagating `undefined` silently into runtime code. The parsed result is a frozen, fully-typed object imported wherever a config value is needed.

## Route Protection

Two wrapper components handle access control:

- `ProtectedRoute` — redirects unauthenticated users to `/login`, preserving the intended destination in router state so the app can return there after a successful login.
- `AdminRoute` — redirects non-admin users to `/403`. Both read from `useAuth()` which is backed by the cached user, so no extra fetching occurs on navigation.

Admin users get a mode toggle in the layout that switches the navigation between the member-facing views and the admin management views, without changing the URL structure.

## Component Layers

`src/components/core/` contains shadcn/ui components verbatim — they are not modified. Custom UI logic lives in `src/components/blocks/`: a generic `DataTable<T>` that accepts a column definition and renders a loading skeleton state, a `Pagination` block, reusable `ConfirmDialog`, and the route guard wrappers. This separation makes it straightforward to upgrade shadcn primitives independently of the application's own component logic.

## Query Client Configuration

```ts
staleTime: 30_000          // cached data is considered fresh for 30 seconds
refetchOnWindowFocus: false // no automatic refetch when the tab regains focus
retry: 1                   // one retry on failed queries
retry: 0                   // no retry on mutations
```

---

## Quick Start

### Prerequisites
- Node.js 18+ or [Bun](https://bun.sh)
- Backend running (see server branch)

### 1. Install

```bash
bun install
```

### 2. Configure

```bash
cp .env.example .env
```

`.env.example`:

```
VITE_API_URL=http://localhost:5000
```

### 3. Run

```bash
bun dev
```

The app runs at `http://localhost:5173` by default.

---

## Stack

| Concern | Library |
|---|---|
| UI primitives | shadcn/ui (Radix UI + Tailwind) |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod |
| Routing | React Router v6 |
| HTTP | Axios |
| Icons | Hugeicons |
| Toasts | Sonner |
| Build | Vite |

---

**Built with React 19 · TypeScript · Vite**
