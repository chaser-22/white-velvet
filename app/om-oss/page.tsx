import type { Metadata } from "next";
import { CtaBand, ImagePlaceholder, PageHero, SectionHeading } from "../components/SitePieces";

export const metadata: Metadata = {
  title: "Om oss",
  description: "Lär känna White Velvet och vårt arbetssätt i Västerås.",
  alternates: { canonical: "https://white-velvet.se/om-oss" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="OM WHITE VELVET" title="Omsorg om detaljerna — från första kontakt till sista intryck." copy="Sidan är redo för företagets riktiga berättelse, team, erfarenhet och verifierade meriter." />
      <section className="section"><div className="container story-grid"><ImagePlaceholder label="Porträtt av White Velvet-teamet" tone="sand" className="story-image tall" /><div className="story-copy"><SectionHeading eyebrow="VÅR BERÄTTELSE" title="Ett lokalt företag med höga ambitioner." /><p className="large-copy">Här berättar vi varför White Velvet startades, vilka behov företaget löser och vad kunder kan förvänta sig av bemötandet.</p><p>Byt texten mot en personlig, konkret berättelse. Lägg gärna till namn på grundare eller team, erfarenhet och vad som gör arbetssättet annorlunda.</p></div></div></section>
      <section className="section section-soft"><div className="container values-grid"><article><span>01</span><h2>Noggrannhet</h2><p>Vi bedömer ytan och planerar behandlingen innan arbetet börjar.</p></article><article><span>02</span><h2>Tydlighet</h2><p>Du ska veta vad som ska göras, vad det kostar och vad du kan förvänta dig.</p></article><article><span>03</span><h2>Omtanke</h2><p>Material, hem och tid behandlas med respekt genom hela uppdraget.</p></article></div></section>
      <CtaBand />
    </>
  );
}
