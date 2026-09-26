"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/content";

export default function V2FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(() => new Set());

  const toggleItem = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

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
            {faqs.map((item, index) => {
              const isOpen = openItems.has(index);
              const answerId = `v2-faq-answer-${index}`;

              return (
                <div
                  className="v2-faq-item"
                  data-open={isOpen ? "true" : "false"}
                  key={item.q}
                >
                  <button
                    className="v2-faq-trigger"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => toggleItem(index)}
                  >
                    <strong>{item.q}</strong>
                    <Plus size={18} aria-hidden="true" />
                  </button>

                  <div
                    className="v2-faq-answer"
                    id={answerId}
                    aria-hidden={!isOpen}
                  >
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
