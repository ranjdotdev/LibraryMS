# LibraryMS — Backend

## Technical Project Overview

## Core Architecture

The backend is structured around a layered architecture: controllers delegate to services, services coordinate through repositories, and repositories own all database access. I introduced a generic `Result<T>` type as the return contract for every service method — rather than throwing exceptions for expected failures (book unavailable, user not found), services return a typed `Result` that controllers inspect and translate to the appropriate HTTP response. This keeps error handling explicit and keeps exception throwing reserved for genuinely unexpected failures.

The project uses a flat, vertically-sliced folder structure under `src/LibraryMS.Api`. Interfaces for services and repositories live alongside their implementations, making the dependency graph easy to follow without hunting across multiple projects.

## Validation

I used FluentValidation with `AddFluentValidationAutoValidation()`, which means any incoming DTO with a registered validator is validated automatically before the controller action runs. Validators are discovered via assembly scanning, so adding a new one requires no registration boilerplate — just implementing `AbstractValidator<T>` is sufficient. Invalid requests are rejected at the framework level with a 400 before any business logic executes.

## Authentication

Authentication is built on ASP.NET Core Identity with a JWT-based flow. Rather than returning the token in the response body, the server writes it into an `httpOnly` cookie on login and register, and clears it on logout. This means JavaScript on the client never touches the raw token, which eliminates the XSS attack surface for credential theft.

The JWT validator is configured to accept the token from the cookie first, and fall back to the `Authorization` header if the cookie is absent — so standard curl/Postman workflows continue to work without modification.

A single static `AuthCookies` class acts as the source of truth for the cookie name, lifetime, and security flags (`HttpOnly`, `Secure`, `SameSite=Strict`). The JWT expiry is derived from the same `Lifetime` constant, so the cookie and the token always expire together.

## Authorization

Authorization uses the two built-in ASP.NET Identity roles: `Admin` and `Member`. Role checks are applied at the controller level with `[Authorize(Roles = "...")]`. I opted against a custom permission system for this project — the scope only requires two distinct access levels, and the built-in role infrastructure handles that cleanly without over-engineering.

## Data Persistence

I configured EF Core using Fluent API in `OnModelCreating` rather than data annotations on entity classes, keeping persistence concerns out of the domain models. Several decisions worth noting:

**Soft deletes** — `Book`, `Category`, and `User` all carry an `IsDeleted` flag. Global query filters are registered on each entity so soft-deleted records are automatically excluded from all LINQ queries without any caller needing to remember a `WHERE` clause. Bypassing the filter is opt-in via `IgnoreQueryFilters()`.

**Optimistic concurrency** — `Book` has a `RowVersion` byte array marked with `[Timestamp]`. EF Core includes the row version in every update statement, so if two requests attempt to modify the same book simultaneously the second one receives a `DbUpdateConcurrencyException` rather than silently overwriting.

**Category uniqueness** — enforced via a unique index, not application-level validation, so the database remains the authoritative constraint.

## Background Processing

An `OverdueWorker` runs as an ASP.NET `BackgroundService`, waking up every hour to scan active borrowing records. Any record past its due date that hasn't been flagged yet is marked `IsOverdue = true` and assigned a fine of **$0.50 per overdue day**. The worker creates its own DI scope on each cycle rather than holding a long-lived `AppDbContext` — this is the standard pattern for using scoped services inside a singleton background worker.

The reward credit system works in the opposite direction: when a book is returned early, the borrower earns up to 10 credit points scaled proportionally to how early the return was relative to the allowed loan period.

## Error Handling

A global `ErrorHandlingMiddleware` catches all unhandled exceptions, logs them, and returns a consistent JSON `{ "error": "..." }` shape. In development the `detail` field exposes the exception message; in production it's suppressed to avoid leaking internal paths, SQL, or secrets.

## Seeding

On startup, `DataSeeder.SeedAsync` runs `MigrateAsync` (creating the database if it doesn't exist and applying any pending migrations), then seeds the two roles and a default admin account if they're absent. This means a fresh clone is one command away from a running state.

---

## Quick Start

### Prerequisites
- .NET 10 SDK
- Docker (for SQL Server)
- [`just`](https://github.com/casey/just) command runner

### 1. Clone and start the database

```bash
git clone <repository-url>
cd LibraryMS
just up
```

### 2. Configuration

`appsettings.json` ships with defaults that match the Docker Compose setup out of the box. For production, override the connection string and JWT secret:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost,1433;Database=LibraryMS;User Id=sa;Password=...;TrustServerCertificate=True"
  },
  "Jwt": {
    "Secret": "your-secret-here",
    "Issuer": "LibraryMS",
    "Audience": "LibraryMS"
  }
}
```

### 3. Run

```bash
just run       # run once
just watch     # run with hot reload
```

Migrations are applied automatically on startup — no separate migration step required for development.

### Other commands

```bash
just migration <Name>    # scaffold a new EF migration
just migrate             # apply pending migrations manually
just reset               # drop the database and re-migrate
just down                # stop Docker containers
```

---

## Default Credentials

| Role  | Email               | Password    |
|-------|---------------------|-------------|
| Admin | admin@library.com   | Admin1234!  |

Member accounts are created via the registration endpoint.

---

## API Overview

- User registration and authentication (cookie-based JWT)
- Book management with search, category filtering, and availability filtering
- Category management
- Borrowing — issue and return, with per-copy availability checking
- Overdue detection and fine calculation (automated, hourly)
- Reward credit on early returns

---

**Built with ASP.NET Core 10 · Entity Framework Core · ASP.NET Identity · SQL Server**
