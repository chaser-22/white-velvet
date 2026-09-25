import { Plus } from "lucide-react";
import { faqs } from "@/lib/content";

export default function V2FAQ() {
  return (
    <section className="v2-faq" id="faq">
      <div className="v2-section-label">
        <p>VANLIGA FRÅGOR</p>
      </div>
      <div className="v2-faq-grid">
        <div>
          <h2>Innan vi kommer.</h2>
        </div>
        <div>
          <div className="v2-faq-list">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>
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
