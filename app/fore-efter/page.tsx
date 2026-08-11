import type { Metadata } from "next";
import { BeforeAfterCard, CtaBand, PageHero } from "../components/SitePieces";

export const metadata: Metadata = {
  title: "Före & efter",
  description: "Se resultat från White Velvets arbete med textilier, mattor och golv.",
  alternates: { canonical: "https://white-velvet.se/fore-efter" },
};

export default function ResultsPage() {
  const captions = ["Ljus tygsoffa", "Textilmatta i vardagsrum", "Matsalsstolar", "Golv med ny lyster", "Båtdynor", "Fåtölj i strukturtyg"];
  return (
    <>
      <PageHero eyebrow="FÖRE & EFTER" title="Resultat som får tala för sig själva." copy="Galleriet är färdigbyggt. Byt platshållarna mot godkända kundbilder och komplettera varje projekt med material, behandling och ort." />
      <section className="section"><div className="container results-grid results-grid-full">{captions.map((caption, index) => <BeforeAfterCard key={caption} index={index + 1} caption={caption} headingLevel={2} />)}</div></section>
      <CtaBand />
    </>
  );
}
