import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const certData = {
  name: "Alice Uwase",
  destination: "Canada",
  provider: "GlobalSafe Insurance",
  coverage: "$250",
  policyNumber: "VS-2026-0042891",
  issueDate: "Mar 15, 2026",
  expiryDate: "Apr 15, 2027",
  status: "Active",
};

export default function Certificate() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            VoyageShield
          </h1>
          <button onClick={() => navigate("/dashboard")} className="btn-outline-maroon text-sm py-2 px-4">
            ← Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">Insurance Certificate</h2>
          <p className="text-muted-foreground mb-8 text-center">Your verified travel insurance document</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card-elevated p-8 sm:p-10 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 gradient-maroon" />
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-5 bg-primary" />
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full opacity-5 bg-primary" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-maroon flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-3">
              V
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">VoyageShield</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Travel Insurance Certificate</p>
          </div>

          {/* Certificate Details */}
          <div className="space-y-4 mb-8">
            {[
              { label: "Policyholder", value: certData.name },
              { label: "Policy Number", value: certData.policyNumber },
              { label: "Destination", value: certData.destination },
              { label: "Insurance Provider", value: certData.provider },
              { label: "Coverage Amount", value: certData.coverage },
              { label: "Issue Date", value: certData.issueDate },
              { label: "Expiry Date", value: certData.expiryDate },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Status Badge */}
          <div className="text-center mb-6">
            <span className="px-4 py-2 rounded-full gradient-maroon text-primary-foreground font-semibold text-sm animate-pulse-glow inline-block">
              ✓ {certData.status} – Verified
            </span>
          </div>

          {/* Mock QR Code */}
          <div className="text-center mb-6">
            <div className="inline-block glass-card p-4">
              <div className="w-32 h-32 mx-auto bg-foreground/10 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-8 gap-0.5 p-2">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Scan to verify authenticity</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-maroon flex-1 py-3">📥 Download PDF</button>
            <button className="btn-outline-maroon flex-1 py-3">📤 Share Certificate</button>
          </div>
        </motion.div>

        {/* Trust notice */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            🔒 This certificate is digitally signed and tamper-proof. Verification ID: {certData.policyNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
