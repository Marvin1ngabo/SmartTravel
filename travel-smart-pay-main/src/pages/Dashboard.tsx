import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressRing from "@/components/ProgressRing";
import PaymentTimeline from "@/components/PaymentTimeline";

const mockUser = {
  name: "Alice Uwase",
  email: "alice@example.com",
  destination: "Canada",
  travelDate: "2026-04-15",
  provider: "GlobalSafe Insurance",
  purpose: "Tourism",
  requiredAmount: 250,
  paidAmount: 120,
  contributions: [
    { date: "Jan 10, 2026", amount: 20, method: "Mobile Money", status: "Successful" },
    { date: "Jan 18, 2026", amount: 35, method: "Visa Card", status: "Successful" },
    { date: "Feb 02, 2026", amount: 15, method: "Mobile Money", status: "Successful" },
    { date: "Feb 14, 2026", amount: 50, method: "Bank Transfer", status: "Successful" },
  ],
};

const providers = [
  { name: "GlobalSafe Insurance", coverage: "Full medical + trip cancellation", price: "$250" },
  { name: "AfroShield Travel Cover", coverage: "Medical + baggage protection", price: "$200" },
  { name: "SecureJourney International", coverage: "Comprehensive all-risk coverage", price: "$300" },
  { name: "TrustGuard Africa", coverage: "Basic medical + emergency evacuation", price: "$180" },
];

const riskLevels: Record<string, { level: string; color: string; minInsurance: string; compliance: string }> = {
  Canada: { level: "Low", color: "bg-green-100 text-green-800", minInsurance: "$250", compliance: "Compliant" },
  Nigeria: { level: "Medium", color: "bg-yellow-100 text-yellow-800", minInsurance: "$200", compliance: "Compliant" },
  Syria: { level: "High", color: "bg-red-100 text-red-800", minInsurance: "$500", compliance: "Pending" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockUser);
  const [selectedProvider, setSelectedProvider] = useState(mockUser.provider);
  const [contributionAmount, setContributionAmount] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);

  const balance = user.requiredAmount - user.paidAmount;
  const progress = Math.round((user.paidAmount / user.requiredAmount) * 100);
  const risk = riskLevels[user.destination] || { level: "Medium", color: "bg-yellow-100 text-yellow-800", minInsurance: "$200", compliance: "Pending" };

  const travelDate = new Date(user.travelDate);
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const weeksLeft = Math.max(1, Math.floor(daysLeft / 7));
  const weeklyAmount = Math.ceil(balance / weeksLeft);

  const handleContribute = (amount: number) => {
    if (amount <= 0 || amount > balance) return;
    setUser(prev => ({
      ...prev,
      paidAmount: Math.min(prev.paidAmount + amount, prev.requiredAmount),
      contributions: [
        { date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), amount, method: "Online Payment", status: "Successful" },
        ...prev.contributions,
      ],
    }));
    setContributionAmount("");
  };

  const milestoneMessage = progress >= 100 ? "🎉 Fully Insured!" : progress >= 75 ? "🔥 Almost there! 75%+ paid" : progress >= 50 ? "💪 Halfway there!" : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>VoyageShield</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/compare")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Compare</button>
            <button onClick={() => navigate("/admin")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Admin</button>
            <div className="w-9 h-9 rounded-full gradient-maroon flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Welcome back, {user.name.split(" ")[0]} 👋</h2>
          <p className="text-muted-foreground mt-1">
            {progress < 100 ? `You're ${progress}% done securing your trip.` : "Your travel insurance is fully secured!"}
          </p>
        </div>

        {/* Notifications */}
        {showNotifications && daysLeft <= 30 && balance > 0 && (
          <div className="space-y-2 animate-fade-in">
            <div className="glass-card-elevated p-4 border-l-4 border-primary flex justify-between items-start">
              <div>
                <p className="font-semibold text-foreground text-sm">⚠️ Payment Reminder</p>
                <p className="text-xs text-muted-foreground">Complete payment at least 5 days before departure. {daysLeft} days remaining.</p>
              </div>
              <button onClick={() => setShowNotifications(false)} className="text-muted-foreground text-xs">✕</button>
            </div>
            <div className="glass-card p-3 border-l-4 border-accent">
              <p className="text-xs text-muted-foreground">📧 Email reminder scheduled: "5 days remaining before departure"</p>
            </div>
          </div>
        )}

        {milestoneMessage && (
          <div className="text-center py-3 glass-card animate-scale-in">
            <p className="text-lg font-semibold text-foreground">{milestoneMessage}</p>
          </div>
        )}

        {/* Main Grid: Overview + Ring + Risk */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Travel Overview */}
          <div className="lg:col-span-2 glass-card-elevated p-5 sm:p-8 animate-fade-in">
            <h3 className="font-serif text-xl font-bold text-foreground mb-6">Travel Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Destination", value: user.destination },
                { label: "Travel Date", value: new Date(user.travelDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                { label: "Provider", value: selectedProvider },
                { label: "Required", value: `$${user.requiredAmount}` },
                { label: "Paid", value: `$${user.paidAmount}`, highlight: true },
                { label: "Remaining", value: `$${balance}` },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className={`font-semibold mt-1 ${item.highlight ? "text-primary" : "text-foreground"}`}>{item.value}</p>
                </div>
              ))}
            </div>
            {progress >= 100 && (
              <button onClick={() => navigate("/certificate")} className="btn-maroon py-2 px-4 text-sm">
                📄 View Certificate
              </button>
            )}
          </div>

          {/* Progress Ring + Countdown */}
          <div className="glass-card-elevated p-5 sm:p-8 flex flex-col items-center justify-center text-center animate-fade-in">
            <ProgressRing progress={progress} />
            <div className="mt-4 w-full border-t border-border/50 pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Departure</p>
              <p className="font-serif text-3xl font-bold text-primary">{daysLeft}</p>
              <p className="text-xs text-muted-foreground">days remaining</p>
            </div>
          </div>
        </div>

        {/* Risk + Smart Suggestion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-card-elevated p-5 animate-fade-in">
            <h3 className="font-serif text-lg font-bold text-foreground mb-4">🌍 Travel Risk Assessment</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${risk.color}`}>{risk.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Min. Insurance Required</span>
                <span className="text-sm font-semibold text-foreground">{risk.minInsurance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Visa Compliance</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${risk.compliance === "Compliant" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {risk.compliance}
                </span>
              </div>
            </div>
          </div>

          {balance > 0 && (
            <div className="glass-card-elevated p-5 border-l-4 border-primary animate-fade-in">
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">💡 Smart Suggestion</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pay <span className="font-bold text-primary">${weeklyAmount}/week</span> to finish before departure ({weeksLeft} weeks remaining).
              </p>
              <button onClick={() => handleContribute(weeklyAmount)} className="btn-maroon py-2 px-4 text-sm w-full">
                Contribute ${weeklyAmount} Now
              </button>
            </div>
          )}
        </div>

        {/* Payment Timeline */}
        <PaymentTimeline progress={progress} contributions={user.contributions} />

        {/* Payment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card-elevated p-5 sm:p-8 animate-fade-in">
            <h3 className="font-serif text-xl font-bold text-foreground mb-4">💰 Contribute Amount</h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              {[10, 25, 50].map(amt => (
                <button key={amt} onClick={() => setContributionAmount(String(amt))} className="btn-outline-maroon py-2 px-4 text-sm">
                  ${amt}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                value={contributionAmount}
                onChange={e => setContributionAmount(e.target.value)}
                placeholder="Custom amount"
                className="input-field flex-1"
                max={balance}
                min={1}
              />
              <button
                onClick={() => handleContribute(Number(contributionAmount))}
                disabled={!contributionAmount || Number(contributionAmount) <= 0 || Number(contributionAmount) > balance}
                className="btn-maroon disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          <div className="glass-card-elevated p-5 sm:p-8 animate-fade-in">
            <h3 className="font-serif text-xl font-bold text-foreground mb-4">💳 Pay Full Balance</h3>
            <p className="text-muted-foreground mb-2">Remaining balance</p>
            <p className="font-serif text-4xl font-bold text-primary mb-6">${balance}</p>
            <button
              onClick={() => handleContribute(balance)}
              disabled={balance <= 0}
              className="btn-maroon w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {balance <= 0 ? "Fully Paid ✓" : "Pay Now"}
            </button>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl font-bold text-foreground">Insurance Providers</h3>
            <button onClick={() => navigate("/compare")} className="text-sm text-primary font-semibold hover:underline">
              Compare All →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.map(p => (
              <div
                key={p.name}
                onClick={() => setSelectedProvider(p.name)}
                className={`provider-card ${selectedProvider === p.name ? "selected" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl gradient-maroon flex items-center justify-center text-primary-foreground font-bold text-sm mb-3">
                  {p.name.charAt(0)}
                </div>
                <h4 className="font-semibold text-foreground text-sm">{p.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{p.coverage}</p>
                <p className="font-bold text-primary text-sm mt-3">{p.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contribution History */}
        <div className="animate-fade-in">
          <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 font-serif text-xl font-bold text-foreground mb-4">
            Contribution History
            <span className="text-sm text-muted-foreground">{showHistory ? "▲" : "▼"}</span>
          </button>
          {showHistory && (
            <div className="glass-card-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">Amount</th>
                      <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">Method</th>
                      <th className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.contributions.map((c, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="p-4 text-sm text-foreground">{c.date}</td>
                        <td className="p-4 text-sm font-semibold text-primary">${c.amount}</td>
                        <td className="p-4 text-sm text-muted-foreground">{c.method}</td>
                        <td className="p-4"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Trust Elements */}
        <div className="glass-card p-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground animate-fade-in">
          <span>🔒 SSL Secured</span>
          <span>•</span>
          <span>🛡️ Licensed Providers</span>
          <span>•</span>
          <span>🏛️ Regulated Platform</span>
          <span>•</span>
          <button onClick={() => navigate("/privacy")} className="text-primary hover:underline">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => navigate("/terms")} className="text-primary hover:underline">Terms</button>
        </div>
      </div>
    </div>
  );
}
