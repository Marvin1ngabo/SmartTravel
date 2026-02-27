import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const sections = [
  { title: "1. Acceptance of Terms", content: "By accessing and using VoyageShield, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform." },
  { title: "2. Service Description", content: "VoyageShield is an insurance brokerage platform that connects travelers with licensed insurance providers. We are NOT an insurance company and do not underwrite any insurance policies. All policies are issued by our partner insurance providers." },
  { title: "3. User Accounts", content: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account." },
  { title: "4. Payments & Contributions", content: "All payments and contributions are processed securely through our certified payment partners. Contributions are held in trust until the full insurance premium is reached, at which point the policy is activated with the selected provider." },
  { title: "5. Refund Policy", content: "Refund requests made more than 14 days before the policy start date are eligible for a full refund minus a 5% processing fee. Requests within 14 days of the start date are subject to the insurance provider's cancellation policy. No refunds after policy activation." },
  { title: "6. Insurance Certificates", content: "Insurance certificates are issued only after full payment is received and confirmed. Certificates are digitally signed and verifiable. Presenting a fraudulent certificate is a criminal offense." },
  { title: "7. Limitation of Liability", content: "VoyageShield acts solely as a broker. We are not liable for claims, coverage disputes, or policy terms — these are governed by the insurance provider's terms. Our liability is limited to the fees collected for our brokerage services." },
  { title: "8. Termination", content: "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or misuse the platform. Upon termination, any pending contributions will be refunded minus applicable fees." },
  { title: "9. Governing Law", content: "These terms are governed by the laws of the Republic of Rwanda. Any disputes shall be resolved through arbitration in Kigali, Rwanda." },
];

export default function Terms() {
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
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Terms & Conditions</h2>
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
