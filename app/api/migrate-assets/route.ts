import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const assets: Record<string, string> = {
  "service-mattvatt": "https://white-velvet.se/ws/media-library/189a21dd2e0b61c86be29683f07d8b57/01.png",
  "service-mobeltvatt": "https://white-velvet.se/ws/media-library/3494052537f835fa2ddea9552148472d/02.png",
  "service-golvpolering": "https://white-velvet.se/ws/media-library/843bcefaec399b2c318936e2c78fd91e/03.png",
  "service-bat-husbil": "https://white-velvet.se/ws/media-library/d5b4cd2bbdc5371c60adbd2ce7dceae6/chatgpt-image-feb-28-2026-06_04_09-pm.png",
  "before-mobeltvatt": "https://white-velvet.se/ws/media-library/e0a496681c1b96d1629830f40c8c8721/4583cf81-f999-46a0-9b33-d3bb6f320448.jpg",
  "after-mobeltvatt": "https://white-velvet.se/ws/media-library/053b36f293a5d04a6c0f72c0d5082f30/c0db9d54-2c9d-4bb2-a578-31a6dde334ca.jpg",
  "before-mattvatt": "https://white-velvet.se/ws/media-library/6889b4813acdb895f17e4d693afedeeb/e5df2470-fd68-4f9e-9f56-70d51525dac5.jpg",
  "after-mattvatt": "https://white-velvet.se/ws/media-library/8ac1fb3e91d798cef756bd5f83985c2a/4ba1e5ea-910b-4d2f-83e9-42d2127ae9de.jpg",
};

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name") || "";
  const source = assets[name];
  if (!source) return NextResponse.json({ error: "Unknown asset" }, { status: 404 });

  const optimized = new URL("/_next/image", request.nextUrl.origin);
  optimized.searchParams.set("url", source);
  optimized.searchParams.set("w", "960");
  optimized.searchParams.set("q", "55");

  const response = await fetch(optimized, {
    headers: { Accept: "image/webp" },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Fetch failed", status: response.status }, { status: 502 });
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  return NextResponse.json({
    name,
    type: response.headers.get("content-type") || "image/webp",
    size: bytes.length,
    base64: bytes.toString("base64"),
  });
}
