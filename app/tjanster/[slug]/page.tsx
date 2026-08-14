import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, ImagePlaceholder, SiteImage } from "../../components/SitePieces";
import { services } from "../../site-data";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};

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
  const host = allowedHosts.has(normalizedHost) && /^[a-z0-9.-]+(?::\d{1,5})?$/.test(normalizedHost)
    ? normalizedHost
    : "white-velvet.se";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const isLocalHost = host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
  const protocol = isLocalHost && forwardedProtocol !== "https" ? "http" : "https";
  const imageUrl = `${protocol}://${host}${service.image}`;
  const socialTitle = `${service.title} | White Velvet`;

  return {
    title: service.title,
    description: service.short,
    alternates: { canonical: `https://white-velvet.se/tjanster/${service.slug}` },
    openGraph: {
      type: "website",
      locale: "sv_SE",
      url: `https://white-velvet.se/tjanster/${service.slug}`,
      title: socialTitle,
      description: service.short,
      images: [{ url: imageUrl, width: 1122, height: 1402, alt: service.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: service.short,
      images: [imageUrl],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <>
      <section className="service-hero">
        <div className="container service-hero-grid">
          <div className="service-hero-copy">
            <Link className="back-link" href="/tjanster">← Alla tjänster</Link>
            <span className="eyebrow eyebrow-light">{service.kicker}</span>
            <h1>{service.title}</h1>
            <p>{service.intro}</p>
            <Link className="button button-light" href={`/boka?service=${service.slug}`}>Be om offert</Link>
          </div>
          <SiteImage
            src={service.image}
            alt={service.imageAlt}
            className="service-hero-image"
            priority
            sizes="(max-width: 900px) 100vw, 55vw"
          />
        </div>
      </section>
      <section className="section">
        <div className="container service-detail-grid">
          <div>
            <span className="eyebrow">DETTA INGÅR</span>
            <h2>Omsorg i varje steg.</h2>
            <ul className="number-list">
              {service.includes.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
            </ul>
          </div>
          <aside className="info-card">
            <span className="eyebrow">PASSAR FÖR</span>
            <ul>{service.goodFor.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="info-note"><strong>Bra att veta</strong><p>{service.note}</p></div>
          </aside>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container mini-gallery">
          <ImagePlaceholder label={`${service.title} — detaljbild`} tone="sand" />
          <ImagePlaceholder label={`${service.title} — före och efter`} tone="navy" />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
