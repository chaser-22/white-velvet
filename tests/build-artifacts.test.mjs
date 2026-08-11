import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const distRoot = fileURLToPath(new URL("../dist/", import.meta.url));

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(entryPath));
    else files.push(entryPath);
  }

  return files;
}

test("production output contains required Sites artifacts and no source maps", async () => {
  const files = await walk(distRoot);
  const relativeFiles = files.map((file) => path.relative(distRoot, file).replaceAll("\\", "/"));

  assert.ok(relativeFiles.includes("server/index.js"));
  assert.ok(relativeFiles.includes(".openai/hosting.json"));
  assert.ok(relativeFiles.includes("client/og.png"));
  assert.ok(relativeFiles.includes("client/.well-known/security.txt"));
  assert.equal(relativeFiles.some((file) => file.endsWith(".map")), false);
});

test("tracked source contains no environment files or private-key material", async () => {
  const ignoredDirectories = new Set([".git", ".next", ".vinext", ".wrangler", "dist", "node_modules", "work"]);

  async function walkSource(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) files.push(...await walkSource(entryPath));
      else files.push(entryPath);
    }
    return files;
  }

  const files = await walkSource(projectRoot);
  assert.equal(files.some((file) => /^\.env(?:\.|$)/.test(path.basename(file))), false);

  for (const file of files.filter((candidate) => /\.(?:[cm]?[jt]sx?|json|md|txt|css)$/i.test(candidate))) {
    const contents = await readFile(file, "utf8");
    assert.doesNotMatch(contents, /BEGIN (?:RSA|OPENSSH|EC|DSA) PRIVATE KEY/, file);
    assert.doesNotMatch(contents, /AKIA[0-9A-Z]{16}/, file);
    assert.doesNotMatch(contents, /sk-[A-Za-z0-9_-]{20,}/, file);
  }
});
