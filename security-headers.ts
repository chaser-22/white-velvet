type SecurityHeaderOptions = {
  development?: boolean;
  https?: boolean;
  nonce?: string;
};

export function buildContentSecurityPolicy(development = false, nonce?: string): string {
  const scriptSources = development
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : nonce
      ? `'self' 'unsafe-inline' 'nonce-${nonce}' 'strict-dynamic'`
      : "'self' 'unsafe-inline'";
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "form-action 'self'",
    `script-src ${scriptSources}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${development ? " ws: wss:" : ""}`,
    "media-src 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(development ? [] : ["upgrade-insecure-requests"]),
  ];

  return directives.join("; ");
}

export function getSecurityHeaders({ development = false, https = false, nonce }: SecurityHeaderOptions = {}): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Security-Policy": buildContentSecurityPolicy(development, nonce),
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-site",
    "Origin-Agent-Cluster": "?1",
    "Permissions-Policy": "accelerometer=(), browsing-topics=(), camera=(), clipboard-read=(), clipboard-write=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), publickey-credentials-get=(), usb=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-XSS-Protection": "0",
  };

  if (https) {
    headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains";
  }

  return headers;
}
