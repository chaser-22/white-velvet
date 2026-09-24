import { Leaf, ScanLine, Clock3, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const values = [
  { icon: ScanLine, title: "Precision", text: "Rätt behandling för rätt material." },
  { icon: Leaf, title: "Skonsamt", text: "Miljömedvetna produkter och metoder." },
  { icon: Clock3, title: "Flexibelt", text: "Ett upplägg som fungerar i vardagen." },
  { icon: Sparkles, title: "Omsorg", text: "Resultat utan onödigt hårda metoder." },
];

export default function About() {
  return (
    <section className="about room-stage" data-room-stage="7">
      <Reveal className="about-statement">
        <p className="eyebrow">WHITE VELVET · VÄSTERÅS</p>
        <h2>Ett rent rum ska inte kännas behandlat.<br />Det ska kännas återställt.</h2>
        <p>
          Vi kombinerar modern utrustning med ett lugnt, materialmedvetet arbetssätt.
          Resultatet ska synas — men behandlingen ska respektera ytan.
        </p>
      </Reveal>
      <div className="value-grid">
        {values.map(({ icon: Icon, title, text }) => (
          <Reveal className="value-card" key={title}>
            <Icon size={20} strokeWidth={1.4} />
            <h3>{title}</h3>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
