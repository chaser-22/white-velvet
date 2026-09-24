import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Cookieinformation" };

export default function CookiesPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← White Velvet</Link>
      <p className="eyebrow">COOKIES</p>
      <h1>Cookieinformation</h1>
      <p>Grundversionen av denna webbplats använder ingen marknadsföringsspårning. Om statistik- eller marknadsföringsverktyg läggs till senare ska denna sida uppdateras och samtycke hanteras där det krävs.</p>
    </main>
  );
}
