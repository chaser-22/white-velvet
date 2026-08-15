# White Velvet security policy

## Scope and security objective

This repository contains a public marketing website. It is designed to minimize its attack surface rather than claim that it is unhackable. The current application has no user accounts, database, first-party cookies, analytics, file uploads, client secrets, or active form-submission endpoint. The only third-party browser surface is an opt-in OpenStreetMap frame for the verified business location.

The quote form is an explicitly labelled demonstration. It validates the user-facing flow locally but does not transmit or store personal information.

## Threat model

### Assets

- Site availability and content integrity
- The White Velvet brand and contact details
- Future quote-request personal data
- Hosted deployment credentials and environment values

### Current trust boundaries

1. A visitor's browser sends requests to either the Sites/Cloudflare edge or Vercel.
2. Sites uses the defensive edge worker; Vercel uses the Nitro serverless adapter and its committed platform-header policy.
3. Both runtimes pass allowed requests to the same vinext application router and serve static assets from the same origin.
4. The local development server is bound to `127.0.0.1` and is not a public service.
5. OpenStreetMap is contacted only after a visitor selects **Visa interaktiv karta**. The frame is credentialless, sandboxed, and restricted to the single allowlisted origin.

There is currently no browser-to-database, browser-to-email, upload, authentication, payment, or analytics boundary.

### Relevant threats

- Cross-site scripting or unsafe browser execution
- Host-header injection into social metadata
- Clickjacking, MIME confusion, referrer leakage, and unnecessary browser permissions
- Accidental secret or source-map publication
- Unsupported state-changing methods
- Dependency or image-parser denial of service
- Misleading collection of personal information before a real backend and privacy policy exist
- Unnecessary third-party map requests or an over-broad framing policy

## Implemented controls

- A per-request cryptographic nonce and strict-dynamic Content Security Policy are used for production HTML.
- Vercel applies a static restrictive CSP and the same frame, MIME, referrer, permissions, HSTS, and cross-origin policies through `vercel.json`; the Cloudflare worker retains the per-request nonce policy.
- CSP restricts scripts, styles, images, connections, forms, frames, workers, embedded objects, and base URLs.
- CSP permits frames only from `https://www.openstreetmap.org`. The map frame is opt-in, credentialless, sandboxed, and can be removed from the page again by the visitor.
- HSTS is returned for HTTPS application responses.
- Clickjacking is blocked with CSP `frame-ancestors 'none'` and `X-Frame-Options: DENY`.
- MIME sniffing, referrer leakage, cross-origin opener/resource behavior, and legacy XSS filtering are explicitly controlled.
- Camera, microphone, location, payment, USB, display capture, and other unused browser capabilities are disabled.
- Only GET and HEAD are accepted. POST, PUT, PATCH, DELETE, and OPTIONS return 405 until an authenticated and validated write endpoint exists.
- HEAD responses contain no body.
- Production browser source maps are disabled and automated tests reject emitted `.map` files.
- Host-derived metadata accepts only the production domains, the exact Sites hostname, and local test hosts. Untrusted hosts fall back to `white-velvet.se`.
- The unused image route redirects same-origin image requests without parsing them and rejects external, protocol-relative, and data URLs.
- Runtime errors return a generic 500 response. Browser responses do not expose server-identification headers.
- Environment files, generated output, credentials, and local runtime data are excluded from source control.
- The demo form has client-side length/format limits, a honeypot, and a minimum completion time, but these are not treated as server-side security controls.

## Dependency status

The last production-only audit before adding the Nitro adapter reported zero known vulnerabilities. The adapter installation completed with the same three findings in the complete dependency tree described below. A fresh production-only registry audit is required before public launch because the post-adapter audit request was unavailable in the current execution environment.

The complete development-tool audit currently reports three transitive findings:

- One low-severity `@babel/core` source-map file-read advisory used through lint tooling.
- Two high-severity `image-size` denial-of-service advisories reported through `vinext`.

The site accepts no uploads, uses only unoptimized same-origin `next/image` output for the supplied logo, rejects remote image-optimizer inputs, and has regression tests for that boundary. No patched `image-size` release is currently available in the installed dependency line. Update the toolchain when compatible patched releases become available and rerun both audits.

## Requirements before enabling submissions or uploads

Do not convert the demo into a live endpoint until all of the following are implemented and tested:

1. Select a delivery/storage provider and document its data-processing terms.
2. Validate and normalize every field on the server with an allowlist schema and strict byte/character limits.
3. Reject unexpected fields, unsupported content types, oversized bodies, and cross-site Origins.
4. Add server-side IP/contact rate limits, replay controls, and monitored abuse thresholds.
5. Add Cloudflare Turnstile or an equivalent control and verify every token server-side.
6. Store credentials only as hosted secrets; never expose them to browser code or source control.
7. Redact personal information from logs and define retention, access, export, and deletion procedures.
8. Send success only after the authoritative backend accepts the request; provide safe failure and retry states.
9. Review and publish the final privacy notice before collecting information.
   The notice should also disclose the on-demand OpenStreetMap request and link to its privacy information.
10. Add endpoint integration tests, monitoring, and an operational owner.

If uploads are later enabled, use a private bucket, randomized object names, size/pixel limits, MIME plus magic-byte checks, malware scanning, image re-encoding, access controls, and retention deletion. Do not request direct camera permission unless a separately reviewed feature genuinely requires it.

## Operational verification

Before each release, run:

```powershell
npm run check
npm audit --omit=dev
npm audit
```

Also verify the deployed HTTPS headers after authentication, confirm the expected access policy, review worker logs for unexpected errors, and retain the previous known-good Sites version for rollback.

Automated checks and this review do not replace an independent penetration test. A professional test is appropriate before introducing public writes, personal-data storage, uploads, authentication, payments, or materially new third-party integrations.

## Reporting a vulnerability

Report suspected vulnerabilities to `info@white-velvet.com`. Do not include passwords, customer data, or other sensitive material in the first message.
