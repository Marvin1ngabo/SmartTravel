import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const steps = ["Travel Details", "Purpose", "Provider"];

const purposes = [
  { id: "tourism", label: "Tourism", icon: "🏖️", desc: "Leisure travel and sightseeing" },
  { id: "study", label: "Study", icon: "🎓", desc: "Academic programs and courses" },
  { id: "work", label: "Work", icon: "💼", desc: "Employment and work permits" },
  { id: "business", label: "Business", icon: "📊", desc: "Meetings, conferences, deals" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [insurancePlans, setInsurancePlans] = useState<any[]>([]);
  const [data, setData] = useState({
    country: "Rwanda", // Fixed to Rwanda
    purpose: "",
    provider: "",
    providerId: "",
    paymentPlan: "gradual", // Default to gradual
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
    
    // Check for saved onboarding data
    const savedData = localStorage.getItem('onboarding_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        toast({
          title: "Welcome back!",
          description: "Your selections have been restored.",
        });
      } catch (error) {
        console.error('Error parsing saved data:', error);
        localStorage.removeItem('onboarding_data');
      }
    }
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

  const selectedProvider = insurancePlans.find(p => p.id === data.providerId);

  const canProceed = () => {
    switch (step) {
      case 0: return !!data.travelDate;
      case 1: return !!data.purpose;
      case 2: return !!data.provider;
      default: return false;
    }
  };

  const handleFinish = async () => {
    if (!user) {
      // Not logged in, save to localStorage and go to auth
      localStorage.setItem('onboarding_data', JSON.stringify(data));
      toast({
        title: "Almost there!",
        description: "Create an account to complete your setup",
      });
      navigate("/auth");
      return;
    }

    // Validate data before sending
    if (!data.travelDate) {
      toast({
        title: "Missing travel date",
        description: "Please select your travel date",
        variant: "destructive",
      });
      return;
    }
    
    if (!data.purpose) {
      toast({
        title: "Missing purpose",
        description: "Please select your travel purpose",
        variant: "destructive",
      });
      return;
    }
    
    if (!data.providerId) {
      toast({
        title: "Missing insurance provider",
        description: "Please select an insurance provider",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        destination: data.country,
        travelDate: new Date(data.travelDate).toISOString(),
        purpose: data.purpose,
        selectedPlanId: data.providerId,
        paymentPlan: data.paymentPlan,
      };

      console.log('User:', user);
      console.log('Sending onboarding data:', payload);

      const result = await api.updateOnboarding(payload);
      
      console.log('Onboarding result:', result);

      toast({
        title: "Setup complete!",
        description: "Your travel insurance is ready to go.",
      });

      // Clear saved data
      localStorage.removeItem('onboarding_data');

      // Refresh user data to get updated hasCompletedOnboarding
      await refreshUser();
      
      // Navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error('Onboarding error details:', {
        error,
        message: error.message,
        response: error.response,
      });
      
      // Show detailed error
      alert(`Error: ${error.message}\n\nCheck console for details.\n\nIs backend running on http://localhost:3001?`);
      
      toast({
        title: "Error",
        description: error.message || "Failed to save onboarding data. Please check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
          VoyageShield
        </h1>
        <div className="flex items-center gap-3">
          {user ? (
            <span className="text-sm text-muted-foreground">
              Logged in as {user.firstName || user.email}
            </span>
          ) : (
            <button onClick={() => navigate("/auth")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Skip to Sign In
            </button>
          )}
        </div>
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
            {/* Step 0: Travel Details */}
            {step === 0 && (
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Travel to Rwanda 🇷🇼</h2>
                <p className="text-muted-foreground mb-6">When are you planning to travel?</p>
                
                <div className="glass-card-elevated p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-border/50">
                    <span className="text-5xl">🇷🇼</span>
                    <div>
                      <p className="font-serif text-2xl font-bold text-foreground">Rwanda</p>
                      <p className="text-sm text-muted-foreground">Land of a Thousand Hills</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Travel Date</label>
                    <input
                      type="date"
                      value={data.travelDate}
                      onChange={e => setData({ ...data, travelDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Select when you plan to arrive in Rwanda</p>
                  </div>

                  <div className="glass-card p-4 border-l-4 border-primary">
                    <p className="text-sm text-foreground font-semibold">ℹ️ Travel Insurance Required</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Travel insurance is recommended for all visitors to Rwanda. Choose from our trusted providers to ensure you're covered.
                    </p>
                  </div>
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

            {/* Step 2: Provider */}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Choose Your Provider</h2>
                <p className="text-muted-foreground mb-2">Trusted insurance companies for Rwanda travel</p>
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
              {isLoading ? "Saving..." : user ? "Go to Dashboard →" : "Create Account →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
