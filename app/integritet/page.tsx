import type { Metadata } from "next";
import { PageHero } from "../components/SitePieces";

export const metadata: Metadata = {
  title: "Integritet",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://white-velvet.se/integritet" },
};

export default function PrivacyPage() {
  return (
    <><PageHero eyebrow="INTEGRITET" title="Din information ska hanteras tydligt." copy="Detta är en strukturell platshållare och ska ersättas med juridiskt granskad information före lansering." /><section className="section"><div className="container legal-copy"><h2>Integritetspolicy — utkast</h2><p>Lägg in personuppgiftsansvarig, organisationsnummer och kontaktuppgifter.</p><h3>Vilka uppgifter samlas in?</h3><p>Beskriv kontaktuppgifter, offertunderlag, eventuella bilder, tekniska loggar och analysdata.</p><h3>Varför behandlas uppgifterna?</h3><p>Beskriv ändamål, rättslig grund, lagringstid och vilka leverantörer som används.</p><h3>Dina rättigheter</h3><p>Lägg in korrekt information om tillgång, rättelse, radering, invändning och kontaktväg.</p><h3>Cookies</h3><p>Komplettera med den slutliga cookie- och samtyckeslösningen.</p></div></section></>
  );
}
