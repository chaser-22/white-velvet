import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "./components/SiteHeader";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "white-velvet.se";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "White Velvet | Professionell textil- och golvvård i Västerås";
  const description = "Professionell mattvätt, möbeltvätt och golvvård i Västerås. Be om en personlig offert från White Velvet.";

  return {
    title: { default: title, template: "%s | White Velvet" },
    description,
    openGraph: {
      type: "website",
      locale: "sv_SE",
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
                <span className="brand-mark" aria-hidden="true">WV</span>
                <span className="brand-type"><strong>WHITE VELVET</strong><small>TEXTIL- & GOLVVÅRD</small></span>
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
              <span>Ankargatan 27, Västerås</span>
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
