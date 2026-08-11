import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const outputRoot = fileURLToPath(new URL("../.vercel/output/", import.meta.url));
const configPath = fileURLToPath(new URL("../.vercel/output/config.json", import.meta.url));
const handlerPath = fileURLToPath(new URL("../.vercel/output/functions/__server.func/index.mjs", import.meta.url));
const logoPath = fileURLToPath(new URL("../.vercel/output/static/brand/white-velvet-logo.png", import.meta.url));

test("emits Vercel Build Output API v3 with a server function and public assets", async () => {
  const config = JSON.parse(await readFile(configPath, "utf8"));
  assert.equal(config.version, 3);
  assert.ok(config.routes.some((route) => route.dest === "/__server"));
  await access(handlerPath);
  await access(logoPath);
  assert.ok(outputRoot.endsWith(".vercel\\output\\") || outputRoot.endsWith(".vercel/output/"));
});

test("Vercel handler renders routes and rejects unsupported methods", async () => {
  const handlerModule = await import(pathToFileURL(handlerPath).href);
  const handler = handlerModule.default;

  const homepage = await handler.fetch(new Request("https://white-velvet.vercel.app/"));
  assert.equal(homepage.status, 200);
  assert.match(await homepage.text(), /<html lang="sv">/);

  const missing = await handler.fetch(new Request("https://white-velvet.vercel.app/release-adapter-check-not-found"));
  assert.equal(missing.status, 404);

  const post = await handler.fetch(new Request("https://white-velvet.vercel.app/", { method: "POST" }));
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET, HEAD");
});
