import { Plus } from "lucide-react";
import { faqs } from "@/lib/content";

export default function V2FAQ() {
  return (
    <section className="v2-faq" id="faq">
      <div className="v2-section-label">
        <span>05</span>
        <p>QUESTIONS / ANSWERS</p>
      </div>
      <div className="v2-faq-grid">
        <div>
          <p className="v2-overline">DET PRAKTISKA</p>
          <h2>Det viktigaste innan vi börjar.</h2>
        </div>
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
    </section>
  );
}
