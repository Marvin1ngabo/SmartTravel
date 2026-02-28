import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"users" | "payments" | "revenue" | "plans">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [insurancePlans, setInsurancePlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    coverage: [""],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, paymentsData, plansData] = await Promise.all([
        api.getAllUsers(),
        api.getAllPayments(),
        api.getInsurancePlans(),
      ]);
      setUsers(usersData);
      setPayments(paymentsData);
      setInsurancePlans(plansData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlan = async () => {
    try {
      const coverage = newPlan.coverage.filter(c => c.trim() !== "");
      await api.createInsurancePlan({
        ...newPlan,
        coverage,
      });
      toast({
        title: "Success",
        description: "Insurance plan created successfully",
      });
      setShowAddPlanModal(false);
      setNewPlan({ name: "", description: "", price: 0, duration: 30, coverage: [""] });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create plan",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePlan = async (id: string, data: any) => {
    try {
      await api.updateInsurancePlan(id, data);
      toast({
        title: "Success",
        description: "Insurance plan updated successfully",
      });
      setEditingPlan(null);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update plan",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this plan?")) return;
    
    try {
      await api.deleteInsurancePlan(id);
      toast({
        title: "Success",
        description: "Insurance plan deactivated",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete plan",
        variant: "destructive",
      });
    }
  };

  const totalRevenue = users.reduce((s, u) => s + (u.totalPaid || 0), 0);
  const totalRequired = users.reduce((s, u) => s + (u.selectedPlan?.price || 0), 0);
  const commission = Math.round(totalRevenue * 0.05);
  const fullyPaid = users.filter(u => u.totalPaid >= (u.selectedPlan?.price || 0)).length;
  const pending = users.length - fullyPaid;

  const stats = [
    { label: "Total Travelers", value: users.length.toString(), icon: "✈️" },
    { label: "Revenue Collected", value: `$${totalRevenue.toLocaleString()}`, icon: "💰" },
    { label: "Fully Paid", value: fullyPaid.toString(), icon: "✅" },
    { label: "Pending", value: pending.toString(), icon: "⏳" },
    { label: "Commission (5%)", value: `$${commission.toLocaleString()}`, icon: "💎" },
    { label: "Completion Rate", value: users.length > 0 ? `${Math.round((fullyPaid / users.length) * 100)}%` : "0%", icon: "📊" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          {(["users", "payments", "revenue", "plans"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab ? "gradient-maroon text-primary-foreground" : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "users" ? "👥 Travelers" : tab === "payments" ? "💳 Payment Logs" : tab === "revenue" ? "📈 Revenue" : "🏢 Insurance Plans"}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["Name", "Email", "Destination", "Provider", "Required", "Paid", "Progress", "Status"].map(h => (
                        <th key={h} className="text-left p-3 text-xs text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      const required = u.selectedPlan?.price || 0;
                      const paid = u.totalPaid || 0;
                      const pct = required > 0 ? Math.round((paid / required) * 100) : 0;
                      const status = pct >= 100 ? "Fully Paid" : pct > 0 ? "Saving" : "Not Started";
                      
                      return (
                        <tr key={u.id} className="border-b border-border/50 last:border-0">
                          <td className="p-3 text-sm font-semibold text-foreground">{u.firstName} {u.lastName}</td>
                          <td className="p-3 text-xs text-muted-foreground">{u.email}</td>
                          <td className="p-3 text-sm text-muted-foreground">{u.destination || 'N/A'}</td>
                          <td className="p-3 text-xs text-muted-foreground">{u.selectedPlan?.name || 'N/A'}</td>
                          <td className="p-3 text-sm text-foreground">${required}</td>
                          <td className="p-3 text-sm font-semibold text-primary">${paid}</td>
                          <td className="p-3">
                            <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                              <div className="h-full gradient-maroon rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              status === "Fully Paid" ? "bg-green-100 text-green-800" :
                              status === "Saving" ? "bg-yellow-100 text-yellow-800" :
                              "bg-secondary text-muted-foreground"
                            }`}>{status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-right">{users.length} travelers</p>
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
                  {payments.map((p, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="p-4 text-sm text-foreground">{new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td className="p-4 text-sm font-semibold text-foreground">{p.user?.firstName} {p.user?.lastName}</td>
                      <td className="p-4 text-sm font-semibold text-primary">${p.amount}</td>
                      <td className="p-4 text-sm text-muted-foreground">{p.metadata?.method || 'Online Payment'}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${p.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td>
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
                {insurancePlans.map(plan => {
                  const planRevenue = users
                    .filter(u => u.selectedPlanId === plan.id)
                    .reduce((s, u) => s + (u.totalPaid || 0), 0);
                  return (
                    <div key={plan.id} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground truncate mr-2">{plan.name}</span>
                      <span className="font-semibold text-foreground">${planRevenue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Insurance Plans Tab */}
        {activeTab === "plans" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-foreground">Insurance Plans</h3>
              <button onClick={() => setShowAddPlanModal(true)} className="btn-maroon py-2 px-4 text-sm">
                + Add New Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insurancePlans.map(plan => (
                <div key={plan.id} className="glass-card-elevated p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-maroon flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {plan.name.charAt(0)}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingPlan(plan)} className="text-xs px-2 py-1 rounded-lg bg-secondary text-muted-foreground hover:text-foreground">
                        ✏️
                      </button>
                      <button onClick={() => handleDeletePlan(plan.id)} className="text-xs px-2 py-1 rounded-lg bg-secondary text-muted-foreground hover:text-destructive">
                        🗑️
                      </button>
                    </div>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-foreground mb-2">{plan.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Price</span>
                      <span className="text-sm font-bold text-primary">${plan.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Duration</span>
                      <span className="text-sm font-semibold text-foreground">{plan.duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Plan Modal */}
        {showAddPlanModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card-elevated p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">Add New Insurance Plan</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Plan Name</label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="input-field w-full"
                    placeholder="e.g., Premium Travel Insurance"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                  <textarea
                    value={newPlan.description}
                    onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}
                    className="input-field w-full"
                    rows={3}
                    placeholder="Brief description of the plan"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Price (USD)</label>
                  <input
                    type="number"
                    value={newPlan.price}
                    onChange={e => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                    className="input-field w-full"
                    placeholder="250"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Duration (days)</label>
                  <input
                    type="number"
                    value={newPlan.duration}
                    onChange={e => setNewPlan({ ...newPlan, duration: Number(e.target.value) })}
                    className="input-field w-full"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Coverage Items</label>
                  {newPlan.coverage.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => {
                          const updated = [...newPlan.coverage];
                          updated[i] = e.target.value;
                          setNewPlan({ ...newPlan, coverage: updated });
                        }}
                        className="input-field flex-1"
                        placeholder="e.g., Medical expenses up to $100k"
                      />
                      {i === newPlan.coverage.length - 1 && (
                        <button
                          onClick={() => setNewPlan({ ...newPlan, coverage: [...newPlan.coverage, ""] })}
                          className="btn-outline-maroon py-2 px-3 text-sm"
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddPlanModal(false)} className="btn-outline-maroon flex-1 py-2">
                  Cancel
                </button>
                <button onClick={handleAddPlan} className="btn-maroon flex-1 py-2">
                  Create Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
