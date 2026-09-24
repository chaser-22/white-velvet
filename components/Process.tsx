const steps = [
  ["01", "INSPECTION", "Material, konstruktion, skick och fläcktyp bedöms innan behandling."],
  ["02", "METHOD", "Metod och intensitet väljs utifrån vad ytan faktiskt tål och behöver."],
  ["03", "RESTORATION", "Smutsen reduceras samtidigt som materialets naturliga uttryck bevaras."],
];

export default function Process() {
  return (
    <section className="process lab-stage" id="om" data-lab-stage="6">
      <div className="process-title">
        <p className="eyebrow">PROTOCOL / 03 STEG</p>
        <h2>Först förstå.<br />Sedan behandla.</h2>
      </div>
      <div className="process-list">
        {steps.map(([num, title, body]) => (
          <div className="process-row" key={num}>
            <span>{num}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
