import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    destination: "",
    travelDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const countries = ["Canada", "United States", "United Kingdom", "France", "Germany", "Nigeria", "South Africa", "Kenya", "Japan", "Australia"];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="floating-shape w-32 h-32 -top-10 -left-10 animate-float" />
        <div className="floating-shape w-24 h-24 bottom-20 right-10 animate-float-delayed" />
        <div className="floating-shape w-16 h-16 top-1/3 right-1/4 animate-float-slow" />

        <div className="relative z-10 max-w-md mx-auto lg:mx-0">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary cursor-pointer mb-2" onClick={() => navigate("/")}>
            VoyageShield
          </h1>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-6 mb-4">
            {isLogin ? "Welcome Back" : "Start Your Journey"}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {isLogin
              ? "Sign in to manage your travel insurance and track your payments."
              : "Create your account and secure your travel insurance before departure."}
          </p>

          <div className="mt-10 space-y-4">
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-maroon flex items-center justify-center text-primary-foreground text-lg">🛡️</div>
              <div>
                <p className="font-semibold text-foreground text-sm">Verified Providers</p>
                <p className="text-xs text-muted-foreground">18 trusted insurance partners</p>
              </div>
            </div>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-maroon flex items-center justify-center text-primary-foreground text-lg">💰</div>
              <div>
                <p className="font-semibold text-foreground text-sm">Flexible Payments</p>
                <p className="text-xs text-muted-foreground">Save gradually or pay at once</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="glass-card-elevated p-6 sm:p-10 w-full max-w-md animate-fade-in">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
            {isLogin ? "Sign In" : "Create Account"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Alice Uwase"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="alice@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Destination Country</label>
                  <select
                    required
                    value={form.destination}
                    onChange={e => setForm({ ...form, destination: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select destination</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Planned Travel Date</label>
                  <input
                    type="date"
                    required
                    value={form.travelDate}
                    onChange={e => setForm({ ...form, travelDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn-maroon w-full mt-2">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
