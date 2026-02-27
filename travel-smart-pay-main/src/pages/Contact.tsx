import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

export default function Contact() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>VoyageShield</h1>
          <button onClick={() => navigate("/")} className="btn-outline-maroon text-sm py-2 px-4">← Home</button>
        </div>
      </nav>
      <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Contact Us</h2>
        <p className="text-muted-foreground mb-8">Have questions? We'd love to hear from you.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: "📧", label: "Email", value: "support@voyageshield.com" },
            { icon: "📞", label: "Phone", value: "+250 788 000 000" },
            { icon: "📍", label: "Location", value: "Kigali, Rwanda" },
          ].map(c => (
            <div key={c.label} className="glass-card p-4 text-center">
              <span className="text-2xl">{c.icon}</span>
              <p className="font-semibold text-foreground text-sm mt-2">{c.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.value}</p>
            </div>
          ))}
        </div>

        {sent ? (
          <div className="glass-card-elevated p-8 text-center">
            <div className="w-16 h-16 rounded-full gradient-maroon flex items-center justify-center text-primary-foreground text-2xl mx-auto mb-4">✓</div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">Message Sent!</h3>
            <p className="text-muted-foreground text-sm">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="glass-card-elevated p-6 sm:p-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
              <input type="text" required className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <input type="email" required className="input-field" placeholder="your@email.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Subject</label>
              <input type="text" required className="input-field" placeholder="How can we help?" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
              <textarea required className="input-field min-h-[120px] resize-none" placeholder="Tell us more..." />
            </div>
            <button type="submit" className="btn-maroon w-full">Send Message</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
