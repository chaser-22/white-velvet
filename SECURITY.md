# White Velvet security policy

## Current attack surface

The public site is intentionally small. It has no user accounts, database, cookies, third-party scripts, file uploads, secrets in the client, or active form submission endpoint. The quote form is a local demonstration and does not transmit personal data.

## Implemented controls

- Security headers are applied both by Next-compatible routing and again at the Cloudflare Worker boundary.
- Content Security Policy limits scripts, styles, images, connections, forms, frames, workers, and embedded objects.
- Camera, microphone, location, payment, USB, display capture, and other unused browser capabilities are disabled.
- Clickjacking, MIME sniffing, referrer leakage, cross-origin isolation issues, and unnecessary server identification are restricted.
- HTTPS responses receive HSTS.
- The edge worker accepts only GET and HEAD. All state-changing HTTP methods return 405 until a real, secured form endpoint is built.
- The unused image optimization endpoint is disabled, removing an unnecessary parser surface.
- The demo form uses field length and format limits, a honeypot, and a minimum completion time. These improve the user-facing template but are not substitutes for server-side controls.
- Host-derived metadata is restricted to known domains to prevent Host header injection.
- Environment files, generated output, credentials, and local runtime data are excluded from source control.

## Requirements before enabling form submissions or uploads

Do not change the demo form into a live endpoint without all of the following:

1. Validate and normalize every field on the server with strict size limits and an allowlist schema.
2. Verify the request Origin and reject cross-site submissions.
3. Add server-side rate limits by IP and normalized contact identifier.
4. Add Cloudflare Turnstile and validate every token server-side. Client-only validation is not protection.
5. Use short request-body limits and explicit content types.
6. Store secrets only as hosted environment secrets, never in source or browser code.
7. Redact personal information from logs and define a retention/deletion schedule.
8. If uploads are enabled, use a separate private bucket, random object names, MIME and magic-byte validation, size and pixel limits, malware scanning, and image re-encoding before any public delivery.
9. Add monitoring for error spikes, rate-limit events, abuse, and deployment changes.
10. Review the privacy policy and processor agreements before collecting real customer data.

## Reporting a vulnerability

Report suspected vulnerabilities to info@white-velvet.com. Do not include passwords, customer data, or other sensitive material in the first message.
