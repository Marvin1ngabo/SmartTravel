import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const providers = [
  {
    name: "GlobalSafe Insurance",
    price: 250,
    medical: "$50,000",
    covid: true,
    luggage: true,
    cancellation: true,
    evacuation: true,
    dental: false,
    deductible: "$100",
    rating: 4.8,
  },
  {
    name: "AfroShield Travel Cover",
    price: 200,
    medical: "$30,000",
    covid: true,
    luggage: true,
    cancellation: false,
    evacuation: true,
    dental: false,
    deductible: "$150",
    rating: 4.5,
  },
  {
    name: "SecureJourney International",
    price: 300,
    medical: "$100,000",
    covid: true,
    luggage: true,
    cancellation: true,
    evacuation: true,
    dental: true,
    deductible: "$50",
    rating: 4.9,
  },
  {
    name: "TrustGuard Africa",
    price: 180,
    medical: "$25,000",
    covid: false,
    luggage: false,
    cancellation: false,
    evacuation: true,
    dental: false,
    deductible: "$200",
    rating: 4.3,
  },
];

const features = [
  { key: "price", label: "Price", render: (p: typeof providers[0]) => `$${p.price}` },
  { key: "medical", label: "Medical Coverage", render: (p: typeof providers[0]) => p.medical },
  { key: "covid", label: "COVID Coverage", render: (p: typeof providers[0]) => p.covid ? "✅ Yes" : "❌ No" },
  { key: "luggage", label: "Lost Luggage", render: (p: typeof providers[0]) => p.luggage ? "✅ Included" : "❌ Not included" },
  { key: "cancellation", label: "Trip Cancellation", render: (p: typeof providers[0]) => p.cancellation ? "✅ Included" : "❌ Not included" },
  { key: "evacuation", label: "Emergency Evacuation", render: (p: typeof providers[0]) => p.evacuation ? "✅ Included" : "❌ Not included" },
  { key: "dental", label: "Dental Coverage", render: (p: typeof providers[0]) => p.dental ? "✅ Included" : "❌ Not included" },
  { key: "deductible", label: "Deductible", render: (p: typeof providers[0]) => p.deductible },
  { key: "rating", label: "Rating", render: (p: typeof providers[0]) => `⭐ ${p.rating}/5` },
];

export default function InsuranceComparison() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [insurancePlans, setInsurancePlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsurancePlans();
  }, []);

  const loadInsurancePlans = async () => {
    try {
      const plans = await api.getInsurancePlans();
      setInsurancePlans(plans);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load insurance plans",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            VoyageShield
          </h1>
          <button onClick={() => navigate(-1)} className="btn-outline-maroon text-sm py-2 px-4">
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Compare Insurance Providers</h2>
          <p className="text-muted-foreground mb-8">Find the perfect coverage for your trip</p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading insurance plans...</p>
          </div>
        ) : insurancePlans.length === 0 ? (
          <div className="glass-card-elevated p-12 text-center">
            <p className="text-muted-foreground">No insurance plans available at the moment.</p>
            <button onClick={() => navigate("/")} className="btn-maroon mt-4">
              Go Home
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="block lg:hidden space-y-4">
              {insurancePlans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card-elevated p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl gradient-maroon flex items-center justify-center text-primary-foreground font-bold">
                      {plan.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                      <p className="font-bold text-primary">${plan.price}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">{plan.duration} days</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Coverage:</span>
                      <ul className="mt-1 space-y-1">
                        {Array.isArray(plan.coverage) && plan.coverage.map((item: string, idx: number) => (
                          <li key={idx} className="text-xs text-foreground">✓ {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button onClick={() => navigate("/onboarding")} className="btn-maroon w-full py-2 text-sm">
                    Select Plan
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Desktop Table View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block glass-card-elevated overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider w-48">Feature</th>
                      {insurancePlans.map(plan => (
                        <th key={plan.id} className="text-center p-4">
                          <div className="w-10 h-10 rounded-xl gradient-maroon flex items-center justify-center text-primary-foreground font-bold mx-auto mb-2">
                            {plan.name.charAt(0)}
                          </div>
                          <p className="font-semibold text-foreground text-sm">{plan.name}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50 bg-primary/5">
                      <td className="p-4 text-sm font-medium text-foreground">Price</td>
                      {insurancePlans.map(plan => (
                        <td key={plan.id} className="p-4 text-center font-bold text-primary text-lg">
                          ${plan.price}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-4 text-sm font-medium text-foreground">Duration</td>
                      {insurancePlans.map(plan => (
                        <td key={plan.id} className="p-4 text-center text-sm text-foreground">
                          {plan.duration} days
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-4 text-sm font-medium text-foreground">Description</td>
                      {insurancePlans.map(plan => (
                        <td key={plan.id} className="p-4 text-center text-sm text-foreground">
                          {plan.description}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-4 text-sm font-medium text-foreground">Coverage</td>
                      {insurancePlans.map(plan => (
                        <td key={plan.id} className="p-4 text-sm text-foreground">
                          <ul className="space-y-1 text-left">
                            {Array.isArray(plan.coverage) && plan.coverage.map((item: string, idx: number) => (
                              <li key={idx} className="text-xs">✓ {item}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4"></td>
                      {insurancePlans.map(plan => (
                        <td key={plan.id} className="p-4 text-center">
                          <button onClick={() => navigate("/onboarding")} className="btn-maroon py-2 px-4 text-sm">
                            Select
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
