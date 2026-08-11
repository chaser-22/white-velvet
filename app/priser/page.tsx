import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero } from "../components/SitePieces";
import { services } from "../site-data";

export const metadata: Metadata = {
  title: "Priser",
  description: "Så fungerar pris och offert för White Velvets rengöringstjänster.",
  alternates: { canonical: "https://white-velvet.se/priser" },
};

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="PRISER" title="Tydligt innan vi börjar." copy="Priset påverkas av material, storlek, skick och plats. Här finns en professionell struktur som fylls med slutliga prisregler före lansering." />
      <section className="section">
        <div className="container pricing-grid">
          {services.map((service) => (
            <article className="price-card" key={service.slug}>
              <span>{service.kicker}</span><h2>{service.title}</h2><strong>Från [pris] kr</strong><p>{service.short}</p><Link className="text-link" href={`/tjanster/${service.slug}`}>Läs mer</Link>
            </article>
          ))}
        </div>
        <div className="container pricing-note"><strong>Prisplatshållare</strong><p>Priserna ovan ska ersättas med godkända belopp, vad som ingår, eventuella minimidebiteringar och framkörningsvillkor.</p></div>
      </section>
      <CtaBand />
    </>
  );
}
