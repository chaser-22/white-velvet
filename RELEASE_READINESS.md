# White Velvet release-readiness report

Audit date: 2026-08-11 (Europe/Stockholm)
Public-release decision: **NO-GO**
Code-only status: **technical release candidate passes the available local gates**

## 1. Executive summary

The website now builds cleanly, installs reproducibly, passes lint and strict type checking, renders every expected route, has a branded 404, and passes the expanded security regression suite. The complete quote-demo interaction, query-string service selection, validation, browser history, mobile navigation, keyboard escape behavior, and responsive layouts were exercised in a real Chromium browser.

The website is not ready for a truthful public launch because the customer-enquiry flow has no delivery backend, the privacy policy is an explicit draft, and public pages intentionally contain prices, photographs, reviews, company details, service areas, hours, and other placeholders. The current Sites deployment is also an older, private version; its application headers could not be inspected anonymously because the sign-in gate returns 401 before the application runs.

No deployment was performed during this audit.

## 2. Application inventory

- Runtime: React 19, vinext, Vite, Cloudflare Worker-compatible ESM
- Hosting: OpenAI Sites project with custom/private access
- HTML routes: `/`, `/tjanster`, four `/tjanster/:slug` pages, `/fore-efter`, `/priser`, `/om-oss`, `/faq`, `/boka`, `/kontakt`, `/integritet`
- Metadata routes: `/robots.txt`, `/sitemap.xml`
- Static security contact: `/.well-known/security.txt`
- Write/API routes: none
- Data stores: none
- Authentication inside the application: none
- Cookies/local storage/session storage: none used by the application
- Analytics/advertising: none
- Third-party browser scripts, fonts, maps, or embeds: none
- Uploads: none
- Form: three-step, client-only demonstration; POST is rejected at the edge

### Current user flows

1. Discover a service from the header, homepage, service grid, or footer.
2. Read the service detail and open `/boka?service=<slug>`.
3. Complete the three-step demo form.
4. Receive an explicit local demo result stating that nothing was sent.
5. Alternatively use the telephone or email links.

The discovery flow is complete. The enquiry-delivery flow is intentionally incomplete and is a release blocker.

## 3. Changes implemented during the audit

- Restored a clean TypeScript pass for Vite and Cloudflare binding types.
- Added explicit `typecheck` and combined `check` scripts.
- Expanded automated coverage across routes, security headers, CSP nonce uniqueness, methods, HEAD behavior, canonical-host safety, error pages, build artifacts, source maps, secret patterns, and image-route restrictions.
- Ensured HEAD responses never include a body.
- Ensured production error responses retain the request nonce and defensive headers.
- Restricted metadata hosts to the exact known production, Sites, and local hosts.
- Added canonical URLs to all public pages and service-detail pages.
- Added branded 404 and application error states.
- Fixed `?service=` preselection, form-step validation, value preservation, step focus, status focus, consent naming, progress semantics, and transparent demo wording.
- Added mobile-menu Escape handling, focus restoration, current-page semantics, and removed hidden-menu links from the mobile focus sequence.
- Fixed 320-pixel FAQ/privacy overflow and long Swedish heading wrapping.
- Fixed skipped heading levels on service and results listing pages.
- Strengthened focus visibility and corrected light-background text colors to meet the targeted contrast ratios.
- Updated project and security documentation.

## 4. Test evidence

| Check | Environment | Result | Evidence |
| --- | --- | --- | --- |
| Clean lockfile install | Node/npm, clean `node_modules` | PASS | 458 packages installed from `package-lock.json` |
| Combined release check | Local production build | PASS | lint, TypeScript, build, 10/10 Node tests |
| Production dependency audit | npm registry | PASS | 0 known vulnerabilities |
| Complete dependency audit | npm registry | CONDITIONAL | 1 low and 2 high development-tool advisories; mitigations below |
| Secret/private-key scan | Tracked and untracked source surface | PASS | no environment files, private keys, AWS IDs, or OpenAI-style keys found |
| Production source maps | `dist/` | PASS | no `.map` artifacts |
| HTML route sweep | Local port 3002 | PASS | all 13 public HTML routes returned 200; invalid routes returned branded 404 |
| Metadata/static routes | Local port 3002 | PASS | robots, sitemap, and security.txt returned 200 |
| Method restrictions | Local edge worker | PASS | POST/PUT/PATCH/DELETE/OPTIONS returned 405 with `Allow: GET, HEAD` |
| Security headers | Built edge worker | PASS | CSP, nonce, HSTS, frame, MIME, referrer, permissions, COOP/COEP/CORP checks passed |
| Host-header safety | Built edge worker | PASS | untrusted hosts, including arbitrary `chatgpt.site` hosts, were not reflected |
| Image parser boundary | Built edge worker | PASS | same-origin redirect only; external, protocol-relative, and data URLs rejected |
| Responsive matrix | In-app Chromium | PASS | 88/88 route/viewport combinations |
| Browser runtime | Fresh Chromium tab | PASS | no console errors or warnings across route sweep |
| Quote demo flow | Chromium, mobile and desktop | PASS | preselection, empty validation, data preservation, consent, success, restart |
| Mobile navigation/history | Chromium at 320 px | PASS | hidden links skipped, Escape closes/restores focus, back/forward paths correct |
| Authenticated deployed app headers | Current Sites URL | NOT RUN | sign-in gate returned 401 before the application; requires authenticated post-deploy check |
| Lighthouse/Core Web Vitals | Production deployment | NOT RUN | no authenticated production measurement surface was available |
| Firefox and Safari/WebKit | External browsers | NOT RUN | unavailable in the current browser-control environment |
| Screen-reader session | Assistive technology | NOT RUN | manual semantic and keyboard checks completed; dedicated AT test still recommended |

### Responsive/browser matrix

The following viewports passed on the homepage, services, representative service detail, results, pricing, about, FAQ, quote, contact, privacy, and 404 surfaces:

| Viewport | Result |
| --- | --- |
| 320×568 | PASS |
| 375×667 | PASS |
| 390×844 | PASS |
| 768×1024 | PASS |
| 1024×768 | PASS |
| 1280×800 | PASS |
| 1440×900 | PASS |
| 1920×1080 | PASS |

Checks included document overflow, text/control clipping, heading and landmark counts, canonical URLs, duplicate IDs, long Swedish copy, sticky header behavior, touch/mobile menu behavior, and direct 404 loading. The 768/320 CSS-pixel checks exercise the layout states expected under high browser zoom, but a native 200% browser-zoom session was not available and is not claimed.

## 5. Security findings

### Closed findings

- **P1 — Type checking failed:** fixed by correcting the Sites plugin import configuration and Cloudflare asset-binding type.
- **P1 — Quote URL did not preselect a service:** fixed and browser-verified.
- **P1 — Quote step two allowed empty progression and lost unmounted values:** fixed and browser-verified.
- **P1 — Hidden mobile links remained in a potential focus sequence:** fixed with visibility/pointer controls and Escape focus restoration.
- **P1 — HEAD responses retained a response body:** fixed and regression-tested.
- **P2 — Arbitrary `chatgpt.site` metadata hosts were accepted:** restricted to the exact Sites hostname.
- **P2 — No project-specific 404/error presentation:** added and tested.
- **P2 — Mobile overflow at 320 px:** fixed on FAQ and privacy pages.
- **P2 — Heading hierarchy skipped from H1 to H3:** fixed on services and results pages.
- **P2 — Several normal-size text tokens missed AA contrast on cream:** replaced with darker accessible tokens.

### Residual dependency findings

The production audit is clean. The complete audit reports:

- Low: `@babel/core` source-map file-read advisory through lint tooling.
- High: two `image-size` infinite-loop advisories through `vinext`.

The affected packages are development/build dependencies. The deployed site has no upload surface, does not use `next/image`, rejects external image inputs, and regression-tests the same-origin redirect behavior. No patched `image-size` version is currently available in the installed line. Keep the toolchain current and rerun both audits before every release.

## 6. Accessibility and visual findings

- One H1 and one main landmark are present on every tested route.
- Heading sequences no longer skip a level.
- Form controls have labels and length/format constraints.
- Dynamic form errors and success states use alert/status semantics.
- Step changes move focus to the new legend; Escape returns focus to the menu button.
- The skip link targets the main content.
- Reduced-motion rules are present.
- Focus indication uses a dual light/dark ring for mixed backgrounds.
- Core light-background normal text meets the targeted 4.5:1 contrast threshold after remediation.
- The design is consistent and professional across all inspected pages, but the visible placeholder copy and imagery prevent it from being a finished public brand presentation.

Representative evidence:

- `release-evidence/screenshots/home-1440x900-final.png`
- `release-evidence/screenshots/home-320x568-final.png`
- `release-evidence/screenshots/mobile-menu-320x568-final.png`
- `release-evidence/screenshots/quote-form-step1-390x844-final.png`
- Additional page screenshots are stored in `release-evidence/screenshots/`.

## 7. Performance observations

- Warm local development median: approximately 102 ms to first byte and 102.3 ms total for the homepage. This is diagnostic only, not a production Web Vitals result.
- Built client output: approximately 2.5 MiB total across 30 files.
- The social preview PNG is approximately 2.08 MiB and is not loaded by normal page navigation.
- The two largest JavaScript chunks are approximately 186 KiB each before transfer compression; the site CSS is approximately 32 KiB.
- There are no third-party fonts, scripts, embeds, or page photographs in the current build.

Production LCP, CLS, and INP must be measured after deploying the exact release candidate behind an authenticated/private preview and again after public access/CDN configuration is final.

## 8. Remaining defects and blockers

| ID | Severity | Finding | Reproduction/evidence | Required action |
| --- | --- | --- | --- | --- |
| RR-001 | P1 | The quote form sends nothing | Complete `/boka`; success explicitly says no data was sent | Select a provider and implement the server-side controls in `SECURITY.md`, or replace the form with truthful phone/email-only contact |
| RR-002 | P1 | Privacy policy is a visible draft | Open `/integritet` | Provide legally reviewed controller, purposes, legal basis, processors, retention, rights, and cookie information before collection |
| RR-003 | P1 | Public pages contain launch placeholders | Prices, reviews, metrics, service areas, hours, organization number, team/story, galleries, and project details visibly say they will be added | Supply and approve the final business content or remove the unfinished sections |
| RR-004 | P1 | Production photography is incomplete | The official supplied logo is integrated in the header, footer, and icon metadata, but placeholder panels remain throughout | Supply hero/team/service photos and approved before/after images with usage consent |
| RR-005 | P1 | Current deployment is not the audited worktree | Sites version 2 points to commit `b58347285fca96de224490b9c9d11c43410f7eb3`; this audit has local changes after that commit | Commit the audited source, save a new Sites version, deploy privately, and rerun deployed checks |
| RR-006 | P1 | Actual application headers on the deployed URL were not authenticated-verified | Anonymous request returns 401 from the sign-in gate with no application CSP/HSTS | Verify the exact private release through an authorized session before changing access |
| RR-007 | P2 | No production Web Vitals evidence | Lighthouse/field measurements unavailable on the private current version | Measure mobile/desktop production and remediate any LCP ≤2.5 s, CLS ≤0.1, or INP ≤200 ms misses |
| RR-008 | P2 | Complete build-tool audit is not zero | npm reports three development-only advisories | Monitor compatible patched releases; keep current runtime mitigations and tests |
| RR-009 | P2 | Monitoring/alert ownership is not configured | No error/availability alert integration is declared | Choose an operational owner and configure privacy-safe availability/error alerts before a live write flow |
| RR-010 | P3 | Firefox, Safari/WebKit, native 200% zoom, and dedicated screen-reader sessions were unavailable | Recorded as NOT RUN in the matrix | Complete human cross-browser and assistive-technology acceptance before public launch |

P0 unresolved: **0**
P1 unresolved: **6**
Public release gate result: **failed**

## 9. Required assets and decisions

Provide the following in one later handoff:

1. Approved hero, team, service, and before/after photography with usage consent.
2. Hero, team, service, equipment, and before/after photographs plus permission to publish them.
3. Organization number, confirmed phone/email/address, opening/telephone hours, response-time wording, and service areas.
4. Final service list, including whether boat/motorhome cleaning is offered.
5. Approved prices, minimum charges, travel charges, inclusions, VAT/RUT wording, and quote rules.
6. Verified reviews, customer names/initials, source links, ratings, and consent.
7. Company story, team names, experience, verified project/years metrics, and any certifications or environmental claims.
8. Final privacy/legal content and the person responsible for data requests.
9. Quote-delivery choice: email service, CRM, database, or phone/email-only; expected notifications and retention period.
10. Desired launch access: private acceptance, workspace-only, custom allowlist, or public; and the final custom-domain/DNS plan.

## 10. Deployment and rollback procedure

### Deployment

1. Resolve RR-001 through RR-006 and replace/remove every visible placeholder.
2. Run a new clean install, `npm run check`, production audit, and complete audit.
3. Commit the exact tested state so the release has an immutable source revision.
4. Save that commit as a new Sites version and deploy it privately first.
5. In an authorized browser session, repeat the critical quote/contact, mobile navigation, 404, metadata, console, and responsive smoke tests.
6. Verify the actual HTTPS response headers, nonce uniqueness, supported methods, caching, robots, sitemap, security.txt, and all static assets on that deployment.
7. Run mobile and desktop production performance measurements.
8. Obtain explicit approval before changing access, custom-domain routing, or DNS.
9. After public launch, verify the public domain again from an anonymous session and monitor errors/availability.

### Rollback

1. Keep the previous known-good Sites version saved and do not overwrite its source provenance.
2. If launch validation fails, redeploy the previous saved version immediately; do not attempt an in-place emergency edit.
3. Confirm the rollback URL, primary routes, security headers, and access policy.
4. If a new write integration is involved, disable/revoke its new secret or route and confirm no personal data was lost or duplicated.
5. Fix forward in a new commit/version, rerun the full gate, and deploy again only after approval.

Current saved rollback references:

- Sites version 2: commit `b58347285fca96de224490b9c9d11c43410f7eb3`
- Sites version 1: commit `cb49312420b477a26444bcce3a20772168abda70`

## 11. Final decision

**NO-GO for public deployment.**

The technical foundation is substantially hardened and verified. The blockers are now explicit: a real and privacy-reviewed enquiry flow, final business/legal content and assets, an immutable committed release, and authenticated verification of the exact deployed candidate. Once those are supplied, rerun this gate and require all P1 items to be closed before changing the decision to GO.
