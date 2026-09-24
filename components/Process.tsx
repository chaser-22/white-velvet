import Reveal from "./Reveal";

const steps = [
  ["01", "Välj tjänst", "Berätta vad du vill ha hjälp med och ge oss de viktigaste detaljerna."],
  ["02", "Önska tid", "Välj ett datum och tidsfönster som passar. Vi bekräftar tiden efter din förfrågan."],
  ["03", "Vi tar hand om resten", "White Velvet återkommer med bekräftelse och praktisk information inför besöket."],
];

export default function Process() {
  return (
    <section className="section-shell process" id="om">
      <div className="process-panel">
        <Reveal className="process-intro">
          <p className="eyebrow light">SÅ FUNGERAR DET</p>
          <h2>En enkel väg till ett renare resultat.</h2>
          <p>
            Rengöring ska kännas trygg från första kontakt till sista detalj. Därför håller vi
            processen tydlig, personlig och lätt att följa.
          </p>
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
