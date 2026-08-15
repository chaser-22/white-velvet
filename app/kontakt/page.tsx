import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/SitePieces";
import { businessLocation } from "../site-data";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakta White Velvet i Västerås via telefon, e-post eller offertformulär.",
  alternates: { canonical: "https://white-velvet.se/kontakt" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="KONTAKT" title="Vi hjälper dig vidare." copy="Hör av dig direkt eller använd offertformuläret för att ge oss mer information om uppdraget." />
      <section className="section"><div className="container contact-grid"><article><span>TELEFON</span><a href="tel:+46739140145">073-914 01 45</a><p>Telefontider: [läggs till]</p></article><article><span>E-POST</span><a href="mailto:info@white-velvet.com">info@white-velvet.com</a><p>Svarstid: [läggs till]</p></article><article><span>ADRESS</span><a href={businessLocation.directionsUrl} target="_blank" rel="noopener noreferrer"><strong>{businessLocation.address}</strong><small>{businessLocation.postalCity}</small></a></article></div><div className="contact-banner"><div><span className="eyebrow eyebrow-light">SNABBARE BEDÖMNING</span><h2>Beskriv uppdraget i formuläret.</h2></div><Link className="button button-light" href="/boka">Starta förfrågan</Link></div></section>
    </>
  );
}
