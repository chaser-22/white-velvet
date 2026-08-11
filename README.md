# White Velvet website

Professional Swedish-language marketing site for White Velvet's textile and floor-care services in Västerås. The application uses React 19, vinext, Vite, and a Cloudflare Worker-compatible Sites deployment.

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
- Shared defensive response policy in `security-headers.ts`
- Sites project binding in `.openai/hosting.json`
- Social-preview image in `public/og.png`

The quote form is intentionally a non-transmitting demonstration. It must not be converted to a live form until the controls in `SECURITY.md` are implemented and a privacy-reviewed delivery/storage service has been selected.

## Release documentation

See `RELEASE_READINESS.md` for the latest audit, unresolved launch blockers, evidence, deployment steps, and rollback procedure. See `SECURITY.md` for the threat model and security policy.
