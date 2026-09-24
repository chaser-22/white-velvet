import Reveal from "./Reveal";

const steps = [
  ["01", "Bedöm materialet", "Vi utgår från material, skick och hur ytan används innan vi väljer metod."],
  ["02", "Behandla kontrollerat", "Rengöringen anpassas för att lösa smuts och fläckar utan onödigt hård behandling."],
  ["03", "Återställ helheten", "Målet är inte bara rent — ytan ska kännas välskött och naturlig igen."],
];

export default function Process() {
  return (
    <section className="process room-stage" id="om" data-room-stage="6">
      <div className="process-editorial">
        <Reveal className="process-intro">
          <p className="eyebrow">METODEN</p>
          <h2>Vi rengör inte allt på samma sätt.</h2>
          <p>White Velvet arbetar materialmedvetet. Det är skillnaden mellan att bara göra rent och att faktiskt ta hand om en yta.</p>
        </Reveal>
        <div className="steps">
          {steps.map(([num, title, body]) => (
            <Reveal key={num} className="step-row">
              <span>{num}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
