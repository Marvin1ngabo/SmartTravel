import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const stats = [
  { value: "12,540+", label: "Travelers Insured" },
  { value: "18", label: "Insurance Providers" },
  { value: "92", label: "Countries Covered" },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden relative flex flex-col">
      {/* Floating shapes */}
      <div className="floating-shape w-64 h-64 -top-20 -right-20 animate-float opacity-10" />
      <div className="floating-shape w-40 h-40 top-1/3 -left-16 animate-float-delayed opacity-10" />
      <div className="floating-shape w-32 h-32 bottom-20 right-1/4 animate-float-slow opacity-10" />

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-primary">VoyageShield</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/faq")} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">FAQ</button>
          <button onClick={() => navigate("/about")} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">About</button>
          <button onClick={() => navigate("/auth")} className="btn-outline-maroon text-sm py-2">Sign In</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight"
        >
          Travel Smart.{" "}
          <span className="text-gradient-maroon">Travel Protected.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed"
        >
          Secure Your Journey Before You Fly. Save gradually or pay at once — your journey, your pace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <button onClick={() => navigate("/onboarding")} className="btn-maroon text-base px-8 py-4">
            Start Saving for Travel Insurance
          </button>
          <button onClick={() => navigate("/onboarding")} className="btn-outline-maroon text-base px-8 py-4">
            Pay Full Insurance Now
          </button>
        </motion.div>

        {/* Animated Insurance Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 max-w-sm mx-auto"
        >
          <div className="glass-card-elevated p-6 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full gradient-maroon opacity-10 -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-maroon flex items-center justify-center text-primary-foreground font-bold text-lg">V</div>
              <div>
                <p className="font-semibold text-foreground text-sm">VoyageShield</p>
                <p className="text-xs text-muted-foreground">Travel Insurance Card</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Traveler</span>
                <span className="font-semibold text-foreground">Alice Uwase</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-semibold text-foreground">Canada 🇨🇦</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coverage</span>
                <span className="font-semibold text-primary">$250</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-primary">48%</span>
                </div>
                <div className="progress-bar h-2">
                  <motion.div
                    className="progress-bar-fill h-2"
                    initial={{ width: 0 }}
                    animate={{ width: "48%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 animate-pulse-glow inline-block">
              <span className="text-xs px-3 py-1 rounded-full gradient-maroon text-primary-foreground font-medium">
                Saving in Progress
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
              className="stat-card"
            >
              <p className="font-serif text-3xl sm:text-4xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="glass-card-elevated p-6 sm:p-8"
        >
          <h3 className="font-serif text-xl font-bold text-foreground text-center mb-6">Why Trust VoyageShield?</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🔒", label: "SSL Secured", desc: "Bank-grade encryption" },
              { icon: "🛡️", label: "Licensed Partners", desc: "18 verified providers" },
              { icon: "📋", label: "GDPR Compliant", desc: "Your data is protected" },
              { icon: "💬", label: "24/7 Support", desc: "Always here to help" },
            ].map(item => (
              <div key={item.label} className="text-center">
                <span className="text-2xl">{item.icon}</span>
                <p className="font-semibold text-foreground text-sm mt-2">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
