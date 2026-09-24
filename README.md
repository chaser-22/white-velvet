# White Velvet — premium Three.js website

A production-oriented Next.js rebuild for White Velvet in Västerås.

## Highlights

- A fixed Three.js / React Three Fiber fabric scene that continues through the **entire website** and reacts to scroll + pointer movement.
- Graceful reduced-motion fallback.
- Premium Scandinavian responsive UI.
- Real White Velvet service / before-after imagery referenced from the current site.
- Multi-step booking request flow with client validation, honeypot spam field and server-side validation.
- Optional booking email delivery via Resend HTTP API (no SDK required).
- SEO metadata, LocalBusiness JSON-LD, sitemap and robots.
- GDPR-oriented privacy / cookie placeholders.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production booking delivery

Set these environment variables in Vercel:

```bash
RESEND_API_KEY=...
BOOKING_FROM_EMAIL=White Velvet <booking@your-verified-domain.se>
BOOKING_TO_EMAIL=info@white-velvet.com
```

Without those variables the booking route validates requests and logs them server-side, which is useful for local development but should not be the final production delivery method.

## Content that should be confirmed before launch

The current White Velvet site is inconsistent about `Båt & husbil` vs `Garagerengöring`. This build preserves both as booking options while presenting Båt & husbil as the fourth visible service. Confirm the final service list with the client before launch.

Legal text under `/integritet` and `/cookies` is intentionally a launch placeholder, not legal advice.
