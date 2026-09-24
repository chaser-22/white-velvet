import { Plus } from "lucide-react";
import { faqs } from "@/lib/content";
import Reveal from "./Reveal";

export default function FAQ() {
  return (
    <section className="faq room-stage" id="faq" data-room-stage="9">
      <Reveal className="section-heading split-heading">
        <div><p className="eyebrow">VANLIGA FRÅGOR</p><h2>Innan vi kommer.</h2></div>
        <p>Saknar du något? Ring eller skicka ett mejl — vi hjälper gärna till att bedöma vad som passar din yta.</p>
      </Reveal>
      <div className="faq-list">
        {faqs.map((faq, i) => (
          <Reveal key={faq.q}>
            <details className="faq-item">
              <summary><span>{String(i + 1).padStart(2, "0")}</span><strong>{faq.q}</strong><Plus size={18} /></summary>
              <p>{faq.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
