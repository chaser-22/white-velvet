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

test("renders the White Velvet site with defensive browser headers", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.match(response.headers.get("permissions-policy") ?? "", /camera=\(\)/);
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.equal(response.headers.get("x-powered-by"), null);

  const html = await response.text();
  assert.match(html, /<html lang="sv">/i);
  assert.match(html, /WHITE VELVET/);
  assert.match(html, /Omsorg som/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("rejects state-changing methods at the edge", async () => {
  const response = await render("http://localhost/boka", { method: "POST" });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
  assert.equal(await response.text(), "Method Not Allowed");
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
});
