## Local development

```bash
npm ci
```

Create `.env.local` and set `CARETWIN_BACKEND_ORIGIN` to the backend's origin (no path), then run `npm run dev`:

```dotenv
CARETWIN_BACKEND_ORIGIN=https://caretwin-backend.onrender.com
```

Next.js proxies `/api/*` to that origin while stripping the `/api` prefix. For example, the frontend request `/api/auth/login` reaches Express at `/auth/login`.

## Vercel and backend configuration

- In **Vercel → Project → Settings → Environment Variables**, set `CARETWIN_BACKEND_ORIGIN=https://caretwin-backend.onrender.com` for Production and any Preview environments that need API access. Enter only the origin, not `/health` or another route.
- Redeploy after changing the value because the external rewrite is configured during the Next.js build.
- In the backend deployment, set `CORS_ORIGINS=https://caretwin-six.vercel.app` and `FRONTEND_URL=https://caretwin-six.vercel.app` (add any other exact frontend origins that should be allowed). For the Vercel-proxied production deployment, set `COOKIE_PATH=/api/auth`, `COOKIE_SAMESITE=strict`, and `TRUST_PROXY_HOPS=2`, as in the backend production example. Keep production cookie security enabled; never expose backend secrets through `NEXT_PUBLIC_*` variables.
- Verify backend readiness at `/health/ready` on its deployed origin before testing the frontend. The backend requires its configured PostgreSQL and Redis services.

Login, signup, email verification, and password recovery use the backend auth API. Signup collects first and last names and follows the backend password rules; after creating an account, users can sign in without completing an email-verification step. Access tokens stay in memory, and the refresh token is held in the backend's HttpOnly cookie. Family, profile, medical-record, and preference data remain browser-local and are not synchronized with the backend yet.

## Validation

```bash
npm run lint
npm run build
```
