import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  
  const email = location.state?.email || "";
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    const lastInput = document.getElementById(`code-${lastIndex}`);
    lastInput?.focus();
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter all 6 digits",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      await api.verifyEmail(email, verificationCode);
      
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      });

      // Refresh user data
      await refreshUser();

      // Navigate to onboarding
      navigate("/onboarding");
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired code",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await api.resendVerificationCode(email);
      
      toast({
        title: "Code sent!",
        description: "A new verification code has been sent to your email.",
      });
      
      setCode(["", "", "", "", "", ""]);
      document.getElementById("code-0")?.focus();
    } catch (error: any) {
      toast({
        title: "Failed to resend",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No email provided</p>
          <button onClick={() => navigate("/auth")} className="btn-maroon">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
          VoyageShield
        </h1>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card-elevated p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full gradient-maroon flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Verify Your Email
              </h2>
              <p className="text-sm text-muted-foreground">
                We've sent a 6-digit code to
              </p>
              <p className="text-sm font-semibold text-foreground mt-1">{email}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block text-center">
                  Enter Verification Code
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold input-field"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying || code.join("").length !== 6}
                className="btn-maroon w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-sm text-primary font-semibold hover:underline disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </button>
              </div>

              <div className="glass-card p-4 border-l-4 border-primary">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Tip:</strong> Check your spam folder if you don't see the email. The code expires in 24 hours.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/auth")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
