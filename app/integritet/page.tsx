import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  alternates: { canonical: "/integritet" },
  openGraph: { url: "/integritet" },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← White Velvet</Link>
      <p className="eyebrow">INTEGRITET</p>
      <h1>Integritetspolicy</h1>
      <p>Denna sida är förberedd för White Velvets slutliga integritetspolicy. Innan lansering bör verksamheten komplettera texten med personuppgiftsansvarig, rättslig grund, lagringstider, mottagare och kontaktväg för registrerades rättigheter.</p>
      <h2>Bokningsförfrågningar</h2>
      <p>Webbplatsens bokningsformulär samlar in de kontakt- och uppdragsuppgifter som krävs för att hantera en förfrågan. Formuläret är byggt för att minimera mängden personuppgifter som efterfrågas.</p>
    </main>
  );
}
