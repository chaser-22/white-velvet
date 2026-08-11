import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, ImagePlaceholder } from "../../components/SitePieces";
import { services } from "../../site-data";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return { title: service.title, description: service.short };
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
          <ImagePlaceholder label={`${service.title} i utförande`} tone="blue" className="service-hero-image" />
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
