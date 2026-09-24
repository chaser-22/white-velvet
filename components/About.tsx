import { Leaf, ScanLine, Clock3, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const values = [
  { icon: ScanLine, title: "Precision", text: "Varje uppdrag bedöms efter material, skick och behov." },
  { icon: Leaf, title: "Miljömedvetet", text: "Skonsamma och noggrant utvalda rengöringsprodukter." },
  { icon: Clock3, title: "Flexibelt", text: "Tider och upplägg anpassas efter uppdragets praktiska förutsättningar." },
  { icon: Sparkles, title: "Omsorg", text: "Fokus på ett välskött resultat utan onödigt hårda metoder." },
];

export default function About() {
  return (
    <section className="section-shell about">
      <Reveal className="about-top">
        <p className="eyebrow">WHITE VELVET</p>
        <h2>Renare ytor. Lugnare helhet.</h2>
        <p>
          White Velvet arbetar med professionell rengöring i Västerås och kombinerar modern
          utrustning med ett materialmedvetet arbetssätt. Målet är enkelt: ett resultat som känns
          lika genomtänkt som det ser ut.
        </p>
      </Reveal>
      <div className="value-grid">
        {values.map(({ icon: Icon, title, text }, index) => (
          <Reveal className="value-card" key={title} delay={index * 0.055}>
            <Icon size={22} strokeWidth={1.5} />
            <h3>{title}</h3>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
