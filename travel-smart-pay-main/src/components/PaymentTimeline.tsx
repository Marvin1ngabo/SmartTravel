import { motion } from "framer-motion";

interface TimelineProps {
  progress: number;
  contributions: { date: string; amount: number }[];
}

const milestones = [
  { label: "First Deposit", pct: 0 },
  { label: "50% Milestone", pct: 50 },
  { label: "Full Payment", pct: 100 },
  { label: "Certificate Ready", pct: 100 },
];

export default function PaymentTimeline({ progress, contributions }: TimelineProps) {
  const hasFirstDeposit = contributions.length > 0;

  const getStatus = (pct: number, idx: number) => {
    if (idx === 0) return hasFirstDeposit;
    if (idx === 3) return progress >= 100;
    return progress >= pct;
  };

  return (
    <div className="glass-card-elevated p-5 sm:p-8">
      <h3 className="font-serif text-xl font-bold text-foreground mb-6">Payment Journey</h3>
      <div className="relative">
        {/* Line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-secondary hidden sm:block" />
        <motion.div
          className="absolute top-4 left-4 h-0.5 gradient-maroon hidden sm:block"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ maxWidth: "calc(100% - 2rem)" }}
        />

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
          {milestones.map((m, i) => {
            const done = getStatus(m.pct, i);
            return (
              <motion.div
                key={m.label}
                className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-500 ${
                  done ? "gradient-maroon text-primary-foreground animate-pulse-glow" : "bg-secondary text-muted-foreground"
                }`}>
                  {done ? "✓" : i + 1}
                </div>
                <p className={`text-xs font-medium sm:mt-2 text-center ${done ? "text-primary" : "text-muted-foreground"}`}>
                  {m.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
