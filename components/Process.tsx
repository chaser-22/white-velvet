const steps = [
  ["01", "LÄS YTAN", "Material, konstruktion, skick och fläcktyp bedöms innan behandling."],
  ["02", "VÄLJ INTENSITET", "Metod och styrka anpassas efter vad ytan faktiskt behöver och tål."],
  ["03", "ÅTERSTÄLL", "Smuts och visuellt brus reduceras utan att materialets naturliga uttryck försvinner."],
];

export default function Process() {
  return (
    <section className="process purity-stage" id="om" data-purity="0.92">
      <div className="process-title">
        <p className="eyebrow">PROCESS / 92% PURE</p>
        <h2>Precision före kraft.</h2>
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
