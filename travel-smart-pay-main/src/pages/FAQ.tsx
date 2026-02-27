import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const faqs = [
  { q: "What is VoyageShield?", a: "VoyageShield is a travel insurance contribution and management platform. We help travelers save gradually or pay at once for their travel insurance before departure." },
  { q: "Is VoyageShield an insurance company?", a: "No. VoyageShield is an insurance brokerage platform. We partner with licensed insurance providers to offer you the best coverage options for your destination." },
  { q: "How does gradual saving work?", a: "You can make small contributions over time towards your insurance premium. Once your balance reaches the required amount, your insurance is activated and you receive your certificate." },
  { q: "What happens if I don't complete payment before travel?", a: "You must complete your insurance payment at least 5 days before departure. We send reminders to help you stay on track. Incomplete payments cannot be used as valid insurance." },
  { q: "Can I get a refund?", a: "Refund policies depend on the insurance provider you selected. Generally, refunds are available if requested more than 14 days before the policy start date. Contact support for details." },
  { q: "Is my payment secure?", a: "Yes. All payments are processed through secure, encrypted channels. We use industry-standard SSL encryption and never store your payment card details." },
  { q: "How do I download my insurance certificate?", a: "Once your insurance is fully paid, go to your Dashboard and click 'Download Certificate'. You can also access the Certificate page from the navigation." },
  { q: "Which countries are covered?", a: "We cover 92+ countries worldwide. Insurance requirements and minimums vary by destination. Our onboarding flow will show you the specific requirements for your chosen country." },
];

export default function FAQ() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>VoyageShield</h1>
          <button onClick={() => navigate("/")} className="btn-outline-maroon text-sm py-2 px-4">← Home</button>
        </div>
      </nav>
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground mb-8">Everything you need to know about VoyageShield</p>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="glass-card-elevated overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full p-5 text-left flex justify-between items-center">
                <span className="font-semibold text-foreground text-sm pr-4">{f.q}</span>
                <span className="text-muted-foreground text-sm shrink-0">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
