import type { Metadata } from "next";
import { CtaBand, PageHero } from "../components/SitePieces";
import { faqs } from "../site-data";

export const metadata: Metadata = { title: "Frågor & svar", description: "Svar på vanliga frågor om White Velvets tjänster, priser och bokning." };

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FRÅGOR & SVAR" title="Det du behöver veta före en bokning." copy="Svaren är skrivna som säkra platshållare. White Velvet bekräftar de slutliga rutinerna före publicering." />
      <section className="section"><div className="container faq-page-list">{faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary><span className="faq-number">{String(index + 1).padStart(2, "0")}</span><strong>{faq.question}</strong><i>+</i></summary><p>{faq.answer}</p></details>)}</div></section>
      <CtaBand />
    </>
  );
}
