/** Cloudflare Worker entry point for the White Velvet site. */
import handler from "vinext/server/app-router-entry";
import { getSecurityHeaders } from "../security-headers";

interface Env {
  ASSETS: Fetcher;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const ALLOWED_METHODS = new Set(["GET", "HEAD"]);

function createNonce(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function secureResponse(response: Response, request: Request, nonce?: string): Response {
  const requestUrl = new URL(request.url);
  const development = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(getSecurityHeaders({ development, https: requestUrl.protocol === "https:", nonce }))) {
    headers.set(name, value);
  }

  headers.delete("Server");
  headers.delete("X-Powered-By");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (!ALLOWED_METHODS.has(request.method)) {
      return secureResponse(
        new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } }),
        request,
      );
    }

    try {
      const requestUrl = new URL(request.url);
      const development = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
      const nonce = development ? undefined : createNonce();
      let securedRequest = request;

      if (nonce) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-nonce", nonce);
        requestHeaders.set("content-security-policy", getSecurityHeaders({ nonce, https: true })["Content-Security-Policy"]);
        securedRequest = new Request(request, { headers: requestHeaders });
      }

      const response = await handler.fetch(securedRequest, env, ctx);
      return secureResponse(response, request, nonce);
    } catch (error) {
      console.error("request_failed", error instanceof Error ? error.message : "unknown_error");
      return secureResponse(new Response("Internal Server Error", { status: 500 }), request);
    }
  },
};

export default worker;
