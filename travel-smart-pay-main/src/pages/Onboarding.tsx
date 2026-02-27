import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const steps = ["Destination", "Purpose", "Insurance Info", "Provider", "Payment Plan"];

const countries = [
  { name: "Canada", flag: "🇨🇦", risk: "Low", minInsurance: 250 },
  { name: "United States", flag: "🇺🇸", risk: "Medium", minInsurance: 300 },
  { name: "United Kingdom", flag: "🇬🇧", risk: "Low", minInsurance: 280 },
  { name: "France", flag: "🇫🇷", risk: "Low", minInsurance: 220 },
  { name: "Germany", flag: "🇩🇪", risk: "Low", minInsurance: 220 },
  { name: "Nigeria", flag: "🇳🇬", risk: "Medium", minInsurance: 200 },
  { name: "South Africa", flag: "🇿🇦", risk: "Medium", minInsurance: 180 },
  { name: "Kenya", flag: "🇰🇪", risk: "Medium", minInsurance: 180 },
  { name: "Japan", flag: "🇯🇵", risk: "Low", minInsurance: 400 },
  { name: "Australia", flag: "🇦🇺", risk: "Low", minInsurance: 350 },
  { name: "Syria", flag: "🇸🇾", risk: "High", minInsurance: 500 },
  { name: "Brazil", flag: "🇧🇷", risk: "Medium", minInsurance: 250 },
];

const purposes = [
  { id: "tourism", label: "Tourism", icon: "🏖️", desc: "Leisure travel and sightseeing" },
  { id: "study", label: "Study", icon: "🎓", desc: "Academic programs and courses" },
  { id: "work", label: "Work", icon: "💼", desc: "Employment and work permits" },
  { id: "business", label: "Business", icon: "📊", desc: "Meetings, conferences, deals" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [insurancePlans, setInsurancePlans] = useState<any[]>([]);
  const [data, setData] = useState({
    country: "",
    purpose: "",
    provider: "",
    providerId: "",
    paymentPlan: "",
    travelDate: "",
  });

  useEffect(() => {
    // Redirect to dashboard if already completed onboarding
    if (user?.hasCompletedOnboarding) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

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
    }
  };

  const selectedCountry = countries.find(c => c.name === data.country);
  const selectedProvider = insurancePlans.find(p => p.id === data.providerId);

  const canProceed = () => {
    switch (step) {
      case 0: return !!data.country && !!data.travelDate;
      case 1: return !!data.purpose;
      case 2: return true;
      case 3: return !!data.provider;
      case 4: return !!data.paymentPlan;
      default: return false;
    }
  };

  const handleFinish = async () => {
    if (!user) {
      // Not logged in, go to auth
      toast({
        title: "Please sign in first",
        description: "Create an account to continue",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await api.updateOnboarding({
        destination: data.country,
        travelDate: new Date(data.travelDate).toISOString(),
        purpose: data.purpose,
        selectedPlanId: data.providerId,
        paymentPlan: data.paymentPlan,
      });

      toast({
        title: "Setup complete!",
        description: "Your travel insurance is ready to go.",
      });

      // Force reload to update user context
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save onboarding data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const riskColor = (risk: string) =>
    risk === "Low" ? "bg-green-100 text-green-800" :
    risk === "Medium" ? "bg-yellow-100 text-yellow-800" :
    "bg-red-100 text-red-800";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
          VoyageShield
        </h1>
        {!user && (
          <button onClick={() => navigate("/auth")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Skip to Sign In
          </button>
        )}
      </nav>

      {/* Progress Indicator */}
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i <= step ? "gradient-maroon text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`hidden sm:block w-12 lg:w-20 h-0.5 mx-1 transition-all duration-300 ${
                  i < step ? "bg-primary" : "bg-secondary"
                }`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Step {step + 1} of {steps.length}: <span className="font-semibold text-foreground">{steps[step]}</span>
        </p>
      </div>

      {/* Step Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 0: Country */}
            {step === 0 && (
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Where are you traveling?</h2>
                <p className="text-muted-foreground mb-6">Select your destination country and travel date</p>
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">Travel Date</label>
                  <input
                    type="date"
                    value={data.travelDate}
                    onChange={e => setData({ ...data, travelDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field max-w-md"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {countries.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setData({ ...data, country: c.name })}
                      className={`glass-card p-4 text-left transition-all duration-300 hover:scale-[1.02] ${
                        data.country === c.name ? "border-2 border-primary shadow-lg" : ""
                      }`}
                    >
                      <span className="text-2xl">{c.flag}</span>
                      <p className="font-semibold text-foreground text-sm mt-2">{c.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${riskColor(c.risk)}`}>
                        {c.risk} Risk
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Purpose */}
            {step === 1 && (
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">What's the purpose of your trip?</h2>
                <p className="text-muted-foreground mb-6">This helps us recommend the right coverage</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {purposes.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setData({ ...data, purpose: p.id })}
                      className={`glass-card-elevated p-6 text-left transition-all duration-300 hover:scale-[1.02] ${
                        data.purpose === p.id ? "border-2 border-primary shadow-lg" : ""
                      }`}
                    >
                      <span className="text-3xl">{p.icon}</span>
                      <p className="font-serif text-lg font-bold text-foreground mt-3">{p.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Insurance Info */}
            {step === 2 && selectedCountry && (
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Insurance Requirements</h2>
                <p className="text-muted-foreground mb-6">Based on your destination and purpose</p>
                <div className="glass-card-elevated p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{selectedCountry.flag}</span>
                    <div>
                      <p className="font-serif text-xl font-bold text-foreground">{selectedCountry.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${riskColor(selectedCountry.risk)}`}>
                        {selectedCountry.risk} Risk
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="glass-card p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Minimum Insurance</p>
                      <p className="font-serif text-2xl font-bold text-primary mt-1">${selectedCountry.minInsurance}</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Risk Level</p>
                      <p className="font-serif text-2xl font-bold text-foreground mt-1">{selectedCountry.risk}</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Visa Compliance</p>
                      <p className="font-serif text-2xl font-bold text-foreground mt-1">✓ Required</p>
                    </div>
                  </div>
                  <div className="glass-card p-4 border-l-4 border-primary">
                    <p className="text-sm text-foreground font-semibold">💡 Recommendation</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      For {data.purpose === "study" ? "students" : data.purpose === "work" ? "workers" : data.purpose === "business" ? "business travelers" : "tourists"} visiting {selectedCountry.name}, 
                      we recommend comprehensive coverage of at least ${selectedCountry.minInsurance}. This ensures visa compliance and full protection.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Provider */}
            {step === 3 && (
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Choose Your Provider</h2>
                <p className="text-muted-foreground mb-2">Recommended providers for {data.country}</p>
                <button onClick={() => navigate("/compare")} className="text-sm text-primary font-semibold hover:underline mb-6 inline-block">
                  📊 Compare providers side by side →
                </button>
                {insurancePlans.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading insurance plans...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {insurancePlans.map(plan => (
                      <button
                        key={plan.id}
                        onClick={() => setData({ ...data, provider: plan.name, providerId: plan.id })}
                        className={`provider-card text-left ${data.provider === plan.name ? "selected" : ""}`}
                      >
                        <div className="w-10 h-10 rounded-xl gradient-maroon flex items-center justify-center text-primary-foreground font-bold text-sm mb-3">
                          {plan.name.charAt(0)}
                        </div>
                        <h4 className="font-semibold text-foreground">{plan.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-muted-foreground">{plan.duration} days</span>
                          <span className="font-bold text-primary">${plan.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Payment Plan */}
            {step === 4 && (
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Choose Your Payment Plan</h2>
                <p className="text-muted-foreground mb-6">How would you like to pay for your insurance?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setData({ ...data, paymentPlan: "gradual" })}
                    className={`glass-card-elevated p-6 text-left transition-all duration-300 hover:scale-[1.02] ${
                      data.paymentPlan === "gradual" ? "border-2 border-primary shadow-lg" : ""
                    }`}
                  >
                    <span className="text-3xl">💰</span>
                    <p className="font-serif text-lg font-bold text-foreground mt-3">Save Gradually</p>
                    <p className="text-sm text-muted-foreground mt-1">Make small contributions over time before your trip</p>
                    {selectedProvider && (
                      <div className="mt-4 glass-card p-3">
                        <p className="text-xs text-muted-foreground">Suggested weekly payment</p>
                        <p className="font-bold text-primary">${Math.ceil(selectedProvider.price / 8)}/week</p>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => setData({ ...data, paymentPlan: "full" })}
                    className={`glass-card-elevated p-6 text-left transition-all duration-300 hover:scale-[1.02] ${
                      data.paymentPlan === "full" ? "border-2 border-primary shadow-lg" : ""
                    }`}
                  >
                    <span className="text-3xl">💳</span>
                    <p className="font-serif text-lg font-bold text-foreground mt-3">Pay Full Now</p>
                    <p className="text-sm text-muted-foreground mt-1">Complete payment in one go and get instant coverage</p>
                    {selectedProvider && (
                      <div className="mt-4 glass-card p-3">
                        <p className="text-xs text-muted-foreground">Total amount</p>
                        <p className="font-bold text-primary">${selectedProvider.price}</p>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
            className="btn-outline-maroon py-2 px-6"
          >
            {step === 0 ? "Home" : "Back"}
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="btn-maroon py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canProceed() || isLoading}
              className="btn-maroon py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : user ? "Complete Setup →" : "Create Account →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
