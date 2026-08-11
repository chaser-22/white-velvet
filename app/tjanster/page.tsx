import type { Metadata } from "next";
import { CtaBand, ImagePlaceholder, PageHero, SectionHeading, ServiceGrid } from "../components/SitePieces";

export const metadata: Metadata = {
  title: "Tjänster",
  description: "Utforska White Velvets tjänster inom mattvätt, möbeltvätt, golvpolering samt rengöring av båt och husbil.",
  alternates: { canonical: "https://white-velvet.se/tjanster" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="TJÄNSTER" title="Rätt behandling börjar med rätt bedömning." copy="Välj en tjänst för att se vad som ingår, vad vi behöver veta och hur du går vidare med en personlig offert." />
      <section className="section">
        <div className="container"><ServiceGrid headingLevel={2} /></div>
      </section>
      <section className="section section-soft">
        <div className="container story-grid reverse">
          <div>
            <SectionHeading eyebrow="VÅRT ARBETSSÄTT" title="Materialet bestämmer metoden." />
            <p className="large-copy">Vi börjar med att förstå ytan, smutsen och målet. Därefter föreslår vi en metod — utan att lova mer än materialet tillåter.</p>
            <ul className="check-list"><li>Bedömning före behandling</li><li>Tydlig förväntansbild</li><li>Anpassad metod och utrustning</li><li>Skötselråd efteråt</li></ul>
          </div>
          <ImagePlaceholder label="Utrustning och materialbedömning" tone="navy" className="story-image" />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
