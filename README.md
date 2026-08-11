# White Velvet website

Professional Swedish-language marketing site for White Velvet's textile and floor-care services in Västerås. The application uses React 19, vinext, and Vite, with production targets for Sites/Cloudflare Workers and Vercel/Nitro.

## Local development

Requirements: Node.js 22.13 or later.

```powershell
npm install
npm run dev -- --port 3002
```

Open `http://localhost:3002`.

## Validation

```powershell
npm run lint
npm run typecheck
npm test
```

`npm test` creates a production build and verifies all public routes, branded error handling, canonical metadata, security headers, per-request CSP nonces, HTTP method restrictions, disabled external image parsing, required Sites output, and absence of obvious credential material.

## Current architecture

- Public content routes under `app/`
- No accounts, cookies, analytics, database, uploads, or third-party browser scripts
- Edge worker in `worker/index.ts`
- Nitro adapter selected automatically for Vercel builds
- Shared defensive response policy in `security-headers.ts`
- Sites project binding in `.openai/hosting.json`
- Social-preview image in `public/og.png`

The quote form is intentionally a non-transmitting demonstration. It must not be converted to a live form until the controls in `SECURITY.md` are implemented and a privacy-reviewed delivery/storage service has been selected.

## Deployment targets

The default build remains the Sites/Cloudflare Worker build:

```powershell
npm run build
```

Vercel reads `vercel.json`, selects the Nitro adapter, and runs `npm run build:vercel`. Nitro emits Vercel Build Output API v3 files under `.vercel/output`, including the serverless function and route manifest. In the Vercel dashboard, keep the repository root as the Root Directory; the committed configuration overrides the framework and build command settings.

For a local Vercel-target verification:

```powershell
npm run build:vercel
```

## Release documentation

See `RELEASE_READINESS.md` for the latest audit, unresolved launch blockers, evidence, deployment steps, and rollback procedure. See `SECURITY.md` for the threat model and security policy.
