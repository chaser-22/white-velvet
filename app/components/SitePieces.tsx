import Link from "next/link";
import { services } from "../site-data";

export function ImagePlaceholder({ label, tone = "navy", className = "" }: { label: string; tone?: "navy" | "sand" | "blue"; className?: string }) {
  return (
    <div className={`image-placeholder placeholder-${tone} ${className}`} role="img" aria-label={label}>
      <span>BILDPLATS</span>
      <strong>{label}</strong>
      <small>Ersätts med originalfoto</small>
    </div>
  );
}

export function ServiceGrid({ limit, headingLevel = 3 }: { limit?: number; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div className="service-grid">
      {services.slice(0, limit ?? services.length).map((service) => (
        <article className="service-card" key={service.slug}>
          <div className="service-card-top">
            <span>{service.number}</span>
            <small>{service.kicker}</small>
          </div>
          <Heading>{service.title}</Heading>
          <p>{service.short}</p>
          <Link className="card-link" href={`/tjanster/${service.slug}`}>
            Läs om tjänsten <span aria-hidden="true">↗</span>
          </Link>
        </article>
      ))}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, copy, align = "left" }: { eyebrow: string; title: string; copy?: string; align?: "left" | "center" }) {
  return (
    <div className={`section-heading ${align === "center" ? "center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

export function BeforeAfterCard({ index, caption, headingLevel = 3 }: { index: number; caption: string; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="result-card">
      <div className={`comparison comparison-${index}`} role="img" aria-label={`Platshållare för före- och efterbild: ${caption}`}>
        <div><span>FÖRE</span></div>
        <div><span>EFTER</span></div>
        <i aria-hidden="true" />
      </div>
      <div className="result-caption">
        <span>PROJEKT {String(index).padStart(2, "0")}</span>
        <Heading>{caption}</Heading>
        <p>Material, behandling och ort läggs in tillsammans med de riktiga bilderna.</p>
      </div>
    </article>
  );
}

export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container cta-band-inner">
        <div>
          <span className="eyebrow eyebrow-light">REDO NÄR DU ÄR</span>
          <h2>Berätta vad du vill få rengjort.</h2>
        </div>
        <div className="cta-actions">
          <Link className="button button-light" href="/boka">Få en kostnadsfri offert</Link>
          <a className="phone-link" href="tel:+46739140145">073-914 01 45</a>
        </div>
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <div>
          <span className="eyebrow eyebrow-light">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
        <p>{copy}</p>
      </div>
    </section>
  );
}
