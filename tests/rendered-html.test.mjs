import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

function render(url = "http://localhost/", init = {}) {
  return worker.fetch(new Request(url, { headers: { accept: "text/html" }, ...init }), env, ctx);
}

const htmlRoutes = [
  "/",
  "/tjanster",
  "/tjanster/mattvatt",
  "/tjanster/mobeltvatt",
  "/tjanster/golvpolering",
  "/tjanster/bat-husbil",
  "/fore-efter",
  "/priser",
  "/om-oss",
  "/faq",
  "/boka",
  "/kontakt",
  "/integritet",
];

test("renders the White Velvet site with defensive browser headers", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.equal(response.headers.get("cross-origin-embedder-policy"), "require-corp");
  assert.equal(response.headers.get("cross-origin-opener-policy"), "same-origin");
  assert.equal(response.headers.get("cross-origin-resource-policy"), "same-site");
  assert.match(response.headers.get("permissions-policy") ?? "", /camera=\(\)/);
  assert.match(response.headers.get("permissions-policy") ?? "", /microphone=\(\)/);
  assert.match(response.headers.get("permissions-policy") ?? "", /geolocation=\(\)/);
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-src https:\/\/www\.openstreetmap\.org/);
  assert.equal(response.headers.get("x-powered-by"), null);
  assert.equal(response.headers.get("server"), null);

  const html = await response.text();
  assert.match(html, /<html lang="sv">/i);
  assert.match(html, /WHITE VELVET/);
  assert.match(html, /Omsorg som/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("uses the verified White Velvet address for an opt-in map", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /Ankargatan 27/);
  assert.match(html, /723 48 Västerås/);
  assert.match(html, /Visa interaktiv karta/);
  assert.match(html, /59\.5978565/);
  assert.match(html, /16\.5860643/);
  assert.match(html, /maps\/dir\/\?api=1&amp;destination=Ankargatan%2027/);
});

test("renders every public HTML route and a branded 404", async () => {
  for (const route of htmlRoutes) {
    const response = await render(`http://localhost${route}`);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, route);
    const html = await response.text();
    assert.match(html, /<main id="main-content">/i, route);
    assert.match(html, /<h1\b/i, route);
  }

  const missing = await render("http://localhost/route-that-does-not-exist");
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /404 · SIDAN SAKNAS|Här blev det inte riktigt som tänkt/);

  const unknownService = await render("http://localhost/tjanster/okand-tjanst");
  assert.equal(unknownService.status, 404);
  assert.match(await unknownService.text(), /404 · SIDAN SAKNAS|Här blev det inte riktigt som tänkt/);
});

test("uses canonical production URLs and never reflects an untrusted Host header", async () => {
  for (const untrustedOrigin of ["https://attacker.example", "https://attacker.chatgpt.site"]) {
    const rootResponse = await render(`${untrustedOrigin}/`);
    const rootHtml = await rootResponse.text();
    assert.match(rootHtml, /<link rel="canonical" href="https:\/\/white-velvet\.se\/?"/i);
    assert.doesNotMatch(rootHtml, new RegExp(new URL(untrustedOrigin).hostname.replaceAll(".", "\\."), "i"));
  }

  const serviceResponse = await render("https://white-velvet-vasteras.ennnyy.chatgpt.site/tjanster/mobeltvatt");
  const serviceHtml = await serviceResponse.text();
  assert.match(serviceHtml, /<link rel="canonical" href="https:\/\/white-velvet\.se\/tjanster\/mobeltvatt"/i);
});

test("keeps the quote form explicitly non-transmitting until a backend exists", async () => {
  const response = await render("http://localhost/boka?service=mobeltvatt");
  const html = await response.text();
  assert.match(html, /formuläret skickar eller sparar inga personuppgifter/i);
  assert.match(html, /action="\/boka"/i);
  assert.match(html, /method="post"/i);
  assert.match(html, /name="privacyAccepted"/i);
  assert.match(html, /maxLength="2000"|maxlength="2000"/i);
});

test("rejects state-changing methods at the edge", async () => {
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
    const response = await render("http://localhost/boka", { method });
    assert.equal(response.status, 405, method);
    assert.equal(response.headers.get("allow"), "GET, HEAD", method);
    assert.equal(await response.text(), "Method Not Allowed", method);
  }
});

test("supports HEAD without returning a response body", async () => {
  const response = await render("http://localhost/", { method: "HEAD" });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("uses a per-request nonce and HSTS for HTTPS production requests", async () => {
  const response = await render("https://white-velvet-vasteras.ennnyy.chatgpt.site/");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("strict-transport-security"), "max-age=63072000; includeSubDomains");

  const csp = response.headers.get("content-security-policy") ?? "";
  const nonceMatch = csp.match(/'nonce-([^']+)'/);
  assert.ok(nonceMatch, "CSP should contain a generated nonce");
  assert.match(csp, /'strict-dynamic'/);
  assert.doesNotMatch(csp, /'unsafe-eval'/);

  const html = await response.text();
  assert.match(html, new RegExp(`nonce=["']${nonceMatch[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`));

  const secondResponse = await render("https://white-velvet-vasteras.ennnyy.chatgpt.site/");
  const secondCsp = secondResponse.headers.get("content-security-policy") ?? "";
  const secondNonceMatch = secondCsp.match(/'nonce-([^']+)'/);
  assert.ok(secondNonceMatch, "Second CSP should contain a generated nonce");
  assert.notEqual(secondNonceMatch[1], nonceMatch[1], "Each request should receive a unique nonce");
});

test("does not expose debug or unsafe image-parser behavior in production", async () => {
  const debugResponse = await render("https://white-velvet.se/__debug");
  assert.equal(debugResponse.status, 404);

  const localImageResponse = await render("https://white-velvet.se/_next/image?url=%2Fog.png&w=640&q=75");
  assert.equal(localImageResponse.status, 302);
  assert.equal(localImageResponse.headers.get("location"), "https://white-velvet.se/og.png");

  for (const unsafeUrl of ["https://example.com/logo.png", "//evil.example/x", "data:text/html,x"]) {
    const response = await render(`https://white-velvet.se/_next/image?url=${encodeURIComponent(unsafeUrl)}&w=640&q=75`);
    assert.equal(response.status, 400, unsafeUrl);
    assert.equal(response.headers.get("location"), null, unsafeUrl);
  }
});
