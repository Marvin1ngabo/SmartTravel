import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockUsers = [
  { id: 1, name: "Alice Uwase", destination: "Canada", required: 250, paid: 120, status: "Saving", provider: "GlobalSafe Insurance", date: "2026-04-15" },
  { id: 2, name: "Jean Habimana", destination: "France", required: 300, paid: 300, status: "Fully Paid", provider: "SecureJourney International", date: "2026-03-20" },
  { id: 3, name: "Grace Mukiza", destination: "United Kingdom", required: 280, paid: 50, status: "Saving", provider: "AfroShield Travel Cover", date: "2026-05-01" },
  { id: 4, name: "Eric Niyonzima", destination: "United States", required: 350, paid: 350, status: "Fully Paid", provider: "GlobalSafe Insurance", date: "2026-06-10" },
  { id: 5, name: "Diane Uwimana", destination: "Germany", required: 220, paid: 0, status: "Not Started", provider: "TrustGuard Africa", date: "2026-07-15" },
  { id: 6, name: "Patrick Mugabo", destination: "Japan", required: 400, paid: 200, status: "Saving", provider: "SecureJourney International", date: "2026-04-28" },
  { id: 7, name: "Marie Claire", destination: "Australia", required: 350, paid: 350, status: "Fully Paid", provider: "GlobalSafe Insurance", date: "2026-03-30" },
  { id: 8, name: "David Nsabimana", destination: "Nigeria", required: 200, paid: 80, status: "Saving", provider: "AfroShield Travel Cover", date: "2026-05-20" },
];

const paymentLogs = [
  { date: "Feb 27, 2026", user: "Alice Uwase", amount: 50, method: "Bank Transfer", status: "Successful" },
  { date: "Feb 26, 2026", user: "David Nsabimana", amount: 30, method: "Mobile Money", status: "Successful" },
  { date: "Feb 25, 2026", user: "Grace Mukiza", amount: 25, method: "Visa Card", status: "Successful" },
  { date: "Feb 24, 2026", user: "Patrick Mugabo", amount: 100, method: "Bank Transfer", status: "Successful" },
  { date: "Feb 23, 2026", user: "Alice Uwase", amount: 20, method: "Mobile Money", status: "Successful" },
];

export default function Admin() {
  const navigate = useNavigate();
  const [filterDest, setFilterDest] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProvider, setFilterProvider] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "payments" | "revenue">("users");
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [users, setUsers] = useState(mockUsers);

  const destinations = [...new Set(users.map(u => u.destination))];
  const providersList = [...new Set(users.map(u => u.provider))];

  const filtered = users.filter(u =>
    (!filterDest || u.destination === filterDest) &&
    (!filterStatus || u.status === filterStatus) &&
    (!filterProvider || u.provider === filterProvider)
  );

  const totalRevenue = users.reduce((s, u) => s + u.paid, 0);
  const totalRequired = users.reduce((s, u) => s + u.required, 0);
  const commission = Math.round(totalRevenue * 0.05);
  const fullyPaid = users.filter(u => u.status === "Fully Paid").length;
  const pending = users.filter(u => u.status !== "Fully Paid").length;

  const handleDeleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleExportCSV = () => {
    const header = "Name,Destination,Required,Paid,Status,Provider\n";
    const rows = filtered.map(u => `${u.name},${u.destination},$${u.required},$${u.paid},${u.status},${u.provider}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voyageshield-travelers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: "Total Travelers", value: users.length.toString(), icon: "✈️" },
    { label: "Revenue Collected", value: `$${totalRevenue.toLocaleString()}`, icon: "💰" },
    { label: "Fully Paid", value: fullyPaid.toString(), icon: "✅" },
    { label: "Pending", value: pending.toString(), icon: "⏳" },
    { label: "Commission (5%)", value: `$${commission.toLocaleString()}`, icon: "💎" },
    { label: "Completion Rate", value: `${Math.round((fullyPaid / users.length) * 100)}%`, icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>VoyageShield</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full gradient-maroon text-primary-foreground font-medium">Admin</span>
            <button onClick={() => navigate("/dashboard")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">User View</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <div className="animate-fade-in">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground mt-1">System-wide insurance management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s, i) => (
            <div key={s.label} className="stat-card animate-fade-in py-4" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="font-serif text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["users", "payments", "revenue"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab ? "gradient-maroon text-primary-foreground" : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "users" ? "👥 Travelers" : tab === "payments" ? "💳 Payment Logs" : "📈 Revenue"}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4 animate-fade-in">
            {/* Filters */}
            <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
              <select value={filterDest} onChange={e => setFilterDest(e.target.value)} className="input-field w-auto text-sm py-2">
                <option value="">All Destinations</option>
                {destinations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-auto text-sm py-2">
                <option value="">All Statuses</option>
                <option value="Fully Paid">Fully Paid</option>
                <option value="Saving">Saving</option>
                <option value="Not Started">Not Started</option>
              </select>
              <select value={filterProvider} onChange={e => setFilterProvider(e.target.value)} className="input-field w-auto text-sm py-2">
                <option value="">All Providers</option>
                {providersList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button onClick={handleExportCSV} className="btn-outline-maroon py-2 px-4 text-sm ml-auto">
                📥 Export CSV
              </button>
            </div>

            {/* Table */}
            <div className="glass-card-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["Name", "Destination", "Provider", "Required", "Paid", "Progress", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left p-3 text-xs text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => {
                      const pct = Math.round((u.paid / u.required) * 100);
                      return (
                        <tr key={u.id} className="border-b border-border/50 last:border-0">
                          <td className="p-3 text-sm font-semibold text-foreground">{u.name}</td>
                          <td className="p-3 text-sm text-muted-foreground">{u.destination}</td>
                          <td className="p-3 text-xs text-muted-foreground">{u.provider}</td>
                          <td className="p-3 text-sm text-foreground">${u.required}</td>
                          <td className="p-3 text-sm font-semibold text-primary">${u.paid}</td>
                          <td className="p-3">
                            <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                              <div className="h-full gradient-maroon rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              u.status === "Fully Paid" ? "bg-green-100 text-green-800" :
                              u.status === "Saving" ? "bg-yellow-100 text-yellow-800" :
                              "bg-secondary text-muted-foreground"
                            }`}>{u.status}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <button onClick={() => setEditingUser(editingUser === u.id ? null : u.id)} className="text-xs px-2 py-1 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                                ✏️
                              </button>
                              <button onClick={() => handleDeleteUser(u.id)} className="text-xs px-2 py-1 rounded-lg bg-secondary text-muted-foreground hover:text-destructive transition-colors">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-right">{filtered.length} of {users.length} travelers shown</p>
          </div>
        )}

        {/* Payment Logs Tab */}
        {activeTab === "payments" && (
          <div className="glass-card-elevated overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-border">
              <h3 className="font-serif text-lg font-bold text-foreground">Recent Payment Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Date", "User", "Amount", "Method", "Status"].map(h => (
                      <th key={h} className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paymentLogs.map((l, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="p-4 text-sm text-foreground">{l.date}</td>
                      <td className="p-4 text-sm font-semibold text-foreground">{l.user}</td>
                      <td className="p-4 text-sm font-semibold text-primary">${l.amount}</td>
                      <td className="p-4 text-sm text-muted-foreground">{l.method}</td>
                      <td className="p-4"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === "revenue" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
            <div className="glass-card-elevated p-6">
              <h3 className="font-serif text-lg font-bold text-foreground mb-4">Revenue Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Collected</span><span className="font-bold text-foreground">${totalRevenue.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Expected</span><span className="font-bold text-foreground">${totalRequired.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Outstanding</span><span className="font-bold text-foreground">${(totalRequired - totalRevenue).toLocaleString()}</span></div>
                <div className="border-t border-border pt-3 flex justify-between"><span className="text-sm text-muted-foreground">Commission (5%)</span><span className="font-bold text-primary">${commission.toLocaleString()}</span></div>
              </div>
            </div>
            <div className="glass-card-elevated p-6">
              <h3 className="font-serif text-lg font-bold text-foreground mb-4">Provider Revenue</h3>
              <div className="space-y-3">
                {providersList.map(p => {
                  const provRevenue = users.filter(u => u.provider === p).reduce((s, u) => s + u.paid, 0);
                  return (
                    <div key={p} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground truncate mr-2">{p}</span>
                      <span className="font-semibold text-foreground">${provRevenue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
