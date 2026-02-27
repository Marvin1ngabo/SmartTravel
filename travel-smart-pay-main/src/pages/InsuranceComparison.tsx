import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

        {/* Mobile Cards View */}
        <div className="block lg:hidden space-y-4">
          {providers.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-elevated p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-maroon flex items-center justify-center text-primary-foreground font-bold">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <p className="font-bold text-primary">${p.price}</p>
                </div>
              </div>
              <div className="space-y-2">
                {features.slice(1).map(f => (
                  <div key={f.key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-medium text-foreground">{f.render(p)}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/onboarding")} className="btn-maroon w-full mt-4 py-2 text-sm">
                Select Provider
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
                  {providers.map(p => (
                    <th key={p.name} className="text-center p-4">
                      <div className="w-10 h-10 rounded-xl gradient-maroon flex items-center justify-center text-primary-foreground font-bold mx-auto mb-2">
                        {p.name.charAt(0)}
                      </div>
                      <p className="font-semibold text-foreground text-sm">{p.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={f.key} className={`border-b border-border/50 ${i === 0 ? "bg-primary/5" : ""}`}>
                    <td className="p-4 text-sm font-medium text-foreground">{f.label}</td>
                    {providers.map(p => (
                      <td key={p.name} className={`p-4 text-center text-sm ${i === 0 ? "font-bold text-primary text-lg" : "text-foreground"}`}>
                        {f.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-4"></td>
                  {providers.map(p => (
                    <td key={p.name} className="p-4 text-center">
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
      </div>
    </div>
  );
}
