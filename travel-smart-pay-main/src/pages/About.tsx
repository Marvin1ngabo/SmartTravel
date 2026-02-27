import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>VoyageShield</h1>
          <button onClick={() => navigate("/")} className="btn-outline-maroon text-sm py-2 px-4">← Home</button>
        </div>
      </nav>
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">About VoyageShield</h2>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <div className="glass-card-elevated p-6">
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">Our Mission</h3>
            <p>VoyageShield was built to ensure every traveler departs with proper insurance coverage. We believe travel protection should be accessible, affordable, and simple — not buried in complex paperwork or expensive upfront costs.</p>
          </div>
          <div className="glass-card-elevated p-6">
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">How It Works</h3>
            <p>We partner with 18+ licensed insurance providers across the globe. Our platform lets you compare coverage options, choose a provider, and pay gradually or all at once. Once fully paid, your insurance certificate is instantly available for download.</p>
          </div>
          <div className="glass-card-elevated p-6">
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">Why Choose Us</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              {[
                { icon: "🛡️", title: "Licensed Providers", desc: "All partners are fully licensed and regulated" },
                { icon: "💰", title: "Flexible Payments", desc: "Save gradually at your own pace" },
                { icon: "🌍", title: "92+ Countries", desc: "Coverage wherever you're headed" },
                { icon: "🔒", title: "Secure Platform", desc: "Bank-grade encryption for all transactions" },
              ].map(item => (
                <div key={item.title} className="glass-card p-4">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-foreground text-sm mt-2">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card-elevated p-6">
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">Important Notice</h3>
            <p className="text-sm">VoyageShield operates as an insurance brokerage platform. We connect travelers with licensed insurance providers but do not underwrite insurance policies ourselves. All insurance products are provided by our partner companies who are fully licensed and regulated in their respective jurisdictions.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
