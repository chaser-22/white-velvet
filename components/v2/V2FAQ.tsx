import { Plus } from "lucide-react";
import { faqs } from "@/lib/content";

export default function V2FAQ() {
  return (
    <section className="v2-faq" id="faq">
      <div className="v2-section-label">
        <span>05</span>
        <p>VANLIGA FRÅGOR</p>
      </div>
      <div className="v2-faq-grid">
        <div>
          <p className="v2-overline">VANLIGA FRÅGOR</p>
          <h2>Innan vi kommer.</h2>
        </div>
        <div>
          <p className="v2-faq-note">Saknar du något? Ring eller skicka ett mejl — vi hjälper gärna till att bedöma vad som passar din yta.</p>
          <div className="v2-faq-list">
          {faqs.map((item, index) => (
            <details key={item.q}>
              <summary>
                <span>0{index + 1}</span>
                <strong>{item.q}</strong>
                <Plus size={18} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
