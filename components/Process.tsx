const steps = [
  ["01", "Se materialet", "Vi bedömer yta, konstruktion, skick och vad som faktiskt behöver behandlas."],
  ["02", "Välj metod", "Rengöringen anpassas efter materialet i stället för att pressa allt genom samma process."],
  ["03", "Återställ", "Smutsen ska bort. Materialets naturliga uttryck ska stanna kvar."],
];

export default function Process() {
  return (
    <section className="process lens-stage" id="om" data-lens-stage="6">
      <div className="process-title">
        <p className="eyebrow">HUR VI ARBETAR</p>
        <h2>Rent är<br />inte en metod.</h2>
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
