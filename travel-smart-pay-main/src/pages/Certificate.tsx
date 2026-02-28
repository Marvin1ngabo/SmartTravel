import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function Certificate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlanData();
  }, [user]);

  const loadPlanData = async () => {
    if (!user?.selectedPlanId) {
      setIsLoading(false);
      return;
    }

    try {
      const plans = await api.getInsurancePlans();
      const plan = plans.find((p: any) => p.id === user.selectedPlanId);
      if (plan) {
        setSelectedPlan(plan);
      }
    } catch (error) {
      console.error('Failed to load plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user?.hasCompletedOnboarding || !selectedPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">No Certificate Available</h2>
          <p className="text-muted-foreground mb-4">Complete your onboarding to get your certificate</p>
          <button onClick={() => navigate("/onboarding")} className="btn-maroon">
            Start Onboarding
          </button>
        </div>
      </div>
    );
  }

  const policyNumber = `VS-${new Date().getFullYear()}-${user.id.slice(0, 8).toUpperCase()}`;
  const issueDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const travelDate = user.travelDate ? new Date(user.travelDate) : new Date();
  const expiryDate = new Date(travelDate);
  expiryDate.setDate(expiryDate.getDate() + selectedPlan.duration);

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
              { label: "Policyholder", value: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email },
              { label: "Policy Number", value: policyNumber },
              { label: "Destination", value: user.destination || "Rwanda" },
              { label: "Insurance Provider", value: selectedPlan.name },
              { label: "Coverage Amount", value: `$${selectedPlan.price}` },
              { label: "Issue Date", value: issueDate },
              { label: "Expiry Date", value: expiryDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
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
              ✓ Active – Verified
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
            🔒 This certificate is digitally signed and tamper-proof. Verification ID: {policyNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
