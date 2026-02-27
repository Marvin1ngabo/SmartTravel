import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const sections = [
  { title: "Information We Collect", content: "We collect personal information you provide during registration, including your name, email address, destination country, travel dates, and payment information. We also collect usage data such as pages visited, features used, and interaction patterns to improve our service." },
  { title: "How We Use Your Information", content: "Your information is used to: process insurance contributions and payments, match you with appropriate insurance providers, send payment reminders and travel alerts, generate insurance certificates, and improve our platform. We never sell your personal data to third parties." },
  { title: "Data Security", content: "We implement industry-standard security measures including SSL/TLS encryption, secure payment processing through certified payment gateways, encrypted data storage, and regular security audits. Your payment card details are never stored on our servers." },
  { title: "Data Sharing", content: "We share your information only with: the insurance provider you select (to process your policy), payment processors (to handle transactions), and as required by law. We do not share your data for advertising or marketing purposes with third parties." },
  { title: "Your Rights", content: "You have the right to: access your personal data, correct inaccurate information, request deletion of your account, export your data, and opt out of marketing communications. Contact us at privacy@voyageshield.com to exercise these rights." },
  { title: "Cookies", content: "We use essential cookies for platform functionality and optional analytics cookies to understand usage patterns. You can manage cookie preferences in your browser settings." },
  { title: "Changes to This Policy", content: "We may update this privacy policy from time to time. We will notify you of significant changes via email or platform notification. Continued use of our service after changes constitutes acceptance of the updated policy." },
];

export default function Privacy() {
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
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Privacy Policy</h2>
        <p className="text-muted-foreground mb-8">Last updated: March 2026</p>
        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i} className="glass-card-elevated p-5 sm:p-6">
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
