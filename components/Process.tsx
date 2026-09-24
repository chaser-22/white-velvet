const steps = [
  ["01","BEDÖM","Material, konstruktion, skick och fläcktyp avgör hur behandlingen ska se ut."],
  ["02","STÄLL IN","Verktyg, intensitet och metod anpassas till just den ytan."],
  ["03","PASSERA","Behandlingen gör jobbet i kontrollerade steg tills ytan är återställd."],
];
export default function Process() {
  return (
    <section className="process treatment-stage" id="om" data-treatment-stage="6">
      <div className="process-title"><p className="eyebrow">WORKFLOW / EFTER BEHANDLINGSLINJEN</p><h2>Rätt verktyg.<br />Rätt tryck.<br />Rätt resultat.</h2></div>
      <div className="process-list">{steps.map(([num,title,body])=><div className="process-row" key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p></div>)}</div>
    </section>
  );
}
