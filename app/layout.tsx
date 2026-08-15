import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "./components/SiteHeader";
import { businessLocation } from "./site-data";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const requestedHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "white-velvet.se";
  const normalizedHost = requestedHost.trim().toLowerCase();
  const allowedHosts = new Set([
    "white-velvet.se",
    "www.white-velvet.se",
    "white-velvet-vasteras.ennnyy.chatgpt.site",
    "localhost:3002",
    "127.0.0.1:3002",
  ]);
  const allowedHost = allowedHosts.has(normalizedHost);
  const host = allowedHost && /^[a-z0-9.-]+(?::\d{1,5})?$/.test(normalizedHost)
    ? normalizedHost
    : "white-velvet.se";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const isLocalHost = host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
  const protocol = isLocalHost && forwardedProtocol !== "https" ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const title = "White Velvet | Professionell textil- och golvvård i Västerås";
  const description = "Professionell mattvätt, möbeltvätt och golvvård i Västerås. Be om en personlig offert från White Velvet.";

  return {
    metadataBase: new URL("https://white-velvet.se"),
    title: { default: title, template: "%s | White Velvet" },
    description,
    icons: {
      icon: [{ url: "/brand/white-velvet-logo.png", type: "image/png" }],
      apple: [{ url: "/brand/white-velvet-logo.png", type: "image/png" }],
    },
    alternates: { canonical: "https://white-velvet.se/" },
    openGraph: {
      type: "website",
      locale: "sv_SE",
      url: "https://white-velvet.se/",
      title,
      description,
      images: [{ url: `${origin}/og.png`, width: 1792, height: 922, alt: "White Velvet — textil- och golvvård i Västerås" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv">
      <body>
        <a className="skip-link" href="#main-content">Hoppa till innehållet</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="container footer-main">
            <div>
              <Link className="brand footer-brand" href="/" aria-label="White Velvet, startsida">
                <Image
                  className="brand-logo"
                  src="/brand/white-velvet-logo.png"
                  width={640}
                  height={400}
                  alt=""
                  loading="lazy"
                  unoptimized
                />
              </Link>
              <p className="footer-note">Professionell rengöring med fokus på material, känsla och ett väl utfört resultat.</p>
            </div>
            <div className="footer-column">
              <strong>Utforska</strong>
              <Link href="/tjanster">Tjänster</Link>
              <Link href="/fore-efter">Före & efter</Link>
              <Link href="/priser">Priser</Link>
              <Link href="/boka">Få offert</Link>
            </div>
            <div className="footer-column">
              <strong>Kontakt</strong>
              <a href="tel:+46739140145">073-914 01 45</a>
              <a href="mailto:info@white-velvet.com">info@white-velvet.com</a>
              <a href={businessLocation.directionsUrl} target="_blank" rel="noopener noreferrer">{businessLocation.address}, Västerås</a>
              <span>Öppettider: [läggs till]</span>
            </div>
            <div className="footer-column">
              <strong>Företag</strong>
              <Link href="/om-oss">Om White Velvet</Link>
              <Link href="/faq">Frågor & svar</Link>
              <Link href="/kontakt">Kontakt</Link>
              <Link href="/integritet">Integritet</Link>
            </div>
          </div>
          <div className="container footer-bottom">
            <span>© {new Date().getFullYear()} White Velvet</span>
            <span>Organisationsnummer: [läggs till]</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
