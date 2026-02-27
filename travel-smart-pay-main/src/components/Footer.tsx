import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const links = [
    { label: "About", path: "/about" },
    { label: "FAQ", path: "/faq" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms & Conditions", path: "/terms" },
  ];

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-xl font-bold text-primary mb-2">VoyageShield</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Secure Your Journey Before You Fly.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">🔒 SSL Secured</span>
              <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">🛡️ Licensed</span>
            </div>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm mb-3">Quick Links</p>
            <div className="space-y-2">
              {links.map(l => (
                <button
                  key={l.path}
                  onClick={() => navigate(l.path)}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm mb-3">Trust & Security</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>🔐 Secure payment processing</p>
              <p>🏛️ Partnered with licensed insurance providers</p>
              <p>📋 GDPR & data protection compliant</p>
              <p>💬 24/7 customer support</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 VoyageShield. All rights reserved. VoyageShield is an insurance brokerage platform — we connect travelers with licensed insurance providers. We are not an insurer.
          </p>
        </div>
      </div>
    </footer>
  );
}
