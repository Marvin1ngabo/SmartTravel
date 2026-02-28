import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export default function VerifyCertificate() {
  const { policyNumber } = useParams<{ policyNumber: string }>();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (policyNumber) {
      verifyCertificate();
    }
  }, [policyNumber]);

  const verifyCertificate = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await api.verifyCertificate(policyNumber!);
      setCertificate(data);
    } catch (err: any) {
      setError(err.message || "Certificate not found or invalid");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-elevated p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Invalid Certificate</h2>
          <p className="text-muted-foreground mb-6">{error || "This certificate could not be verified."}</p>
          <button onClick={() => navigate("/")} className="btn-maroon py-2 px-6">
            Go to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  const isExpired = certificate.expiryDate && new Date(certificate.expiryDate) < new Date();
  const isActive = certificate.status === 'active' && !isExpired;

  return (
    <div className="min-h-screen bg-background">
      <nav className="glass-card border-b border-border/50 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            VoyageShield
          </h1>
          <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground font-medium">
            Certificate Verification
          </span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`w-24 h-24 rounded-full ${isActive ? 'bg-green-100' : 'bg-yellow-100'} flex items-center justify-center mx-auto mb-4`}>
            <span className="text-5xl">{isActive ? '✓' : '⚠️'}</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            {isActive ? 'Certificate Verified' : 'Certificate Status'}
          </h2>
          <p className="text-muted-foreground">
            {isActive ? 'This is a valid VoyageShield insurance certificate' : 'This certificate has issues'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card-elevated p-8 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 gradient-maroon" />
          
          {/* Status Badge */}
          <div className="text-center mb-6">
            <span className={`px-4 py-2 rounded-full font-semibold text-sm inline-block ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : isExpired 
                ? 'bg-red-100 text-red-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isActive ? '✓ Active & Valid' : isExpired ? '✗ Expired' : '⚠ ' + certificate.status}
            </span>
          </div>

          {/* Certificate Details */}
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-border/50">
              <h3 className="font-serif text-2xl font-bold text-foreground">{certificate.policyNumber}</h3>
              <p className="text-sm text-muted-foreground mt-1">Policy Number</p>
            </div>

            {[
              { label: "Policyholder", value: certificate.holderName },
              { label: "Destination", value: certificate.destination },
              { label: "Insurance Provider", value: certificate.providerName },
              { label: "Coverage Amount", value: `$${certificate.coverageAmount}` },
              { label: "Issue Date", value: new Date(certificate.issueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
              { label: "Expiry Date", value: new Date(certificate.expiryDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
              { label: "Duration", value: `${certificate.duration} days` },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Verification Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground text-center">
                🔒 This certificate was verified on {new Date().toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Issued by VoyageShield Travel Insurance Platform
              </p>
            </div>
          </div>

          {/* Warning for expired */}
          {isExpired && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-sm text-red-800 font-semibold">⚠️ This certificate has expired</p>
              <p className="text-xs text-red-700 mt-1">
                This insurance coverage is no longer valid. Please contact the policyholder for updated information.
              </p>
            </div>
          )}
        </motion.div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground mb-4">
            For questions about this certificate, please contact VoyageShield support
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate("/")} className="btn-outline-maroon py-2 px-6 text-sm">
              Visit Homepage
            </button>
            <button onClick={() => window.print()} className="btn-maroon py-2 px-6 text-sm">
              Print Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
