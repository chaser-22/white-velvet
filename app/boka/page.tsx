import type { Metadata } from "next";
import { QuoteForm } from "../components/QuoteForm";
import { PageHero } from "../components/SitePieces";

export const metadata: Metadata = { title: "Få offert", description: "Be om en personlig offert för mattvätt, möbeltvätt eller golvvård i Västerås." };

export default function QuotePage() {
  return (
    <>
      <PageHero eyebrow="OFFERTFÖRFRÅGAN" title="Vi börjar med ditt behov." copy="Tre enkla steg ger White Velvet rätt underlag för en snabb och personlig bedömning." />
      <section className="section quote-section"><div className="container quote-layout"><QuoteForm /><aside className="quote-aside"><span className="eyebrow">VAD HÄNDER SEN?</span><ol><li><span>01</span><p>Vi granskar din beskrivning.</p></li><li><span>02</span><p>Du får frågor eller ett förslag.</p></li><li><span>03</span><p>Tid och pris bekräftas tillsammans.</p></li></ol><div className="contact-mini"><strong>Vill du hellre ringa?</strong><a href="tel:+46739140145">073-914 01 45</a></div></aside></div></section>
    </>
  );
}
