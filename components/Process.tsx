import Reveal from "./Reveal";

const steps = [
  ["01", "Bedömning", "Vi börjar med materialet, skicket och vad ytan faktiskt behöver."],
  ["02", "Behandling", "Metod och intensitet anpassas för att rengöra effektivt utan onödigt slitage."],
  ["03", "Resultat", "Ytan lämnas ren, välskött och så naturlig i sitt uttryck som möjligt."],
];

export default function Process() {
  return (
    <section className="studio-process" id="om">
      <Reveal className="studio-section-intro process-heading">
        <p className="eyebrow">SÅ ARBETAR VI</p>
        <h2>Omsorg i tre steg.</h2>
      </Reveal>

      <div className="process-grid">
        {steps.map(([number, title, body]) => (
          <Reveal key={number} className="process-card">
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
