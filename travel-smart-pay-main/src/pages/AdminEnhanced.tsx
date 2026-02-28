import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"users" | "payments" | "revenue" | "plans">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [insurancePlans, setInsurancePlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [filterPlan, setFilterPlan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Modal states
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
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
        api.getAllUsers().catch(err => { console.error('Failed to load users:', err); return []; }),
        api.getAllPayments().catch(err => { console.error('Failed to load payments:', err); return []; }),
        api.getInsurancePlans().catch(err => { console.error('Failed to load plans:', err); return []; }),
      ]);
      setUsers(usersData || []);
      setPayments(paymentsData || []);
      setInsurancePlans(plansData || []);
    } catch (error: any) {
      console.error('Load data error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on all criteria
  const filteredUsers = users.filter(user => {
    const matchesPlan = !filterPlan || user.selectedPlanId === filterPlan;
    const matchesDestination = !filterDestination || user.destination === filterDestination;
    const matchesSearch = !searchQuery || 
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const required = user.selectedPlan?.price || 0;
    const paid = user.totalPaid || 0;
    const pct = required > 0 ? Math.round((paid / required) * 100) : 0;
    const status = pct >= 100 ? "Fully Paid" : pct > 0 ? "Saving" : "Not Started";
    const matchesStatus = !filterStatus || status === filterStatus;
    
    const userDate = user.createdAt ? new Date(user.createdAt) : null;
    const matchesDateFrom = !dateFrom || !userDate || userDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || !userDate || userDate <= new Date(dateTo);
    
    return matchesPlan && matchesDestination && matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchQuery ||
      payment.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const paymentDate = payment.createdAt ? new Date(payment.createdAt) : null;
    const matchesDateFrom = !dateFrom || !paymentDate || paymentDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || !paymentDate || paymentDate <= new Date(dateTo);
    
    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  // Get unique destinations
  const destinations = [...new Set(users.map(u => u.destination).filter(Boolean))];

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Destination", "Provider", "Required", "Paid", "Status", "Date Joined"];
    const rows = filteredUsers.map(u => {
      const required = u.selectedPlan?.price || 0;
      const paid = u.totalPaid || 0;
      const pct = required > 0 ? Math.round((paid / required) * 100) : 0;
      const status = pct >= 100 ? "Fully Paid" : pct > 0 ? "Saving" : "Not Started";
      
      return [
        `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        u.email,
        u.destination || 'N/A',
        u.selectedPlan?.name || 'N/A',
        required,
        paid,
        status,
        u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voyageshield-travelers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: `Exported ${filteredUsers.length} travelers to CSV`,
    });
  };

  // Export payments to CSV
  const exportPaymentsToCSV = () => {
    const headers = ["Date", "User", "Email", "Amount", "Currency", "Method", "Status"];
    const rows = filteredPayments.map(p => [
      new Date(p.createdAt).toLocaleDateString(),
      `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim(),
      p.user?.email || 'N/A',
      p.amount,
      p.currency,
      p.metadata?.method || 'Online Payment',
      p.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voyageshield-payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: `Exported ${filteredPayments.length} payments to CSV`,
    });
  };

  // Generate PDF Report (simple HTML to print)
  const generatePDFReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const totalRevenue = filteredUsers.reduce((s, u) => s + (u.totalPaid || 0), 0);
    const totalRequired = filteredUsers.reduce((s, u) => s + (u.selectedPlan?.price || 0), 0);
    const fullyPaid = filteredUsers.filter(u => u.totalPaid >= (u.selectedPlan?.price || 0)).length;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VoyageShield Admin Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #8B0000; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #8B0000; color: white; }
          .summary { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .summary-item { margin: 10px 0; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h1>VoyageShield Admin Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
          <h2>Summary</h2>
          <div class="summary-item"><strong>Total Travelers:</strong> ${filteredUsers.length}</div>
          <div class="summary-item"><strong>Revenue Collected:</strong> $${totalRevenue.toLocaleString()}</div>
          <div class="summary-item"><strong>Total Expected:</strong> $${totalRequired.toLocaleString()}</div>
          <div class="summary-item"><strong>Fully Paid:</strong> ${fullyPaid}</div>
          <div class="summary-item"><strong>Pending:</strong> ${filteredUsers.length - fullyPaid}</div>
        </div>
        
        <h2>Travelers</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Destination</th>
              <th>Provider</th>
              <th>Required</th>
              <th>Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredUsers.map(u => {
              const required = u.selectedPlan?.price || 0;
              const paid = u.totalPaid || 0;
              const pct = required > 0 ? Math.round((paid / required) * 100) : 0;
              const status = pct >= 100 ? "Fully Paid" : pct > 0 ? "Saving" : "Not Started";
              
              return `
                <tr>
                  <td>${u.firstName || ''} ${u.lastName || ''}</td>
                  <td>${u.email}</td>
                  <td>${u.destination || 'N/A'}</td>
                  <td>${u.selectedPlan?.name || 'N/A'}</td>
                  <td>$${required}</td>
                  <td>$${paid}</td>
                  <td>${status}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <button onclick="window.print()" style="margin: 20px 0; padding: 10px 20px; background: #8B0000; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Print / Save as PDF
        </button>
      </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
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

  const clearFilters = () => {
    setFilterPlan("");
    setFilterStatus("");
    setFilterDestination("");
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
  };

  const totalRevenue = filteredUsers.reduce((s, u) => s + (u.totalPaid || 0), 0);
  const totalRequired = filteredUsers.reduce((s, u) => s + (u.selectedPlan?.price || 0), 0);
  const fullyPaid = filteredUsers.filter(u => u.totalPaid >= (u.selectedPlan?.price || 0)).length;
  const pending = filteredUsers.length - fullyPaid;

  const stats = [
    { label: "Total Travelers", value: filteredUsers.length.toString(), icon: "✈️" },
    { label: "Revenue Collected", value: `$${totalRevenue.toLocaleString()}`, icon: "💰" },
    { label: "Fully Paid", value: fullyPaid.toString(), icon: "✅" },
    { label: "Pending", value: pending.toString(), icon: "⏳" },
    { label: "Completion Rate", value: filteredUsers.length > 0 ? `${Math.round((fullyPaid / filteredUsers.length) * 100)}%` : "0%", icon: "📊" },
    { label: "Avg Payment", value: filteredUsers.length > 0 ? `$${Math.round(totalRevenue / filteredUsers.length)}` : "$0", icon: "💵" },
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
          <p className="text-muted-foreground mt-1">System-wide insurance management & analytics</p>
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

        {/* Filters */}
        <div className="glass-card-elevated p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Filters & Search</h3>
            <button onClick={clearFilters} className="text-sm text-primary hover:underline">Clear All</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field"
            />
            
            <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} className="input-field">
              <option value="">All Insurance Plans</option>
              {insurancePlans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
            
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field">
              <option value="">All Statuses</option>
              <option value="Fully Paid">Fully Paid</option>
              <option value="Saving">Saving</option>
              <option value="Not Started">Not Started</option>
            </select>
            
            <select value={filterDestination} onChange={e => setFilterDestination(e.target.value)} className="input-field">
              <option value="">All Destinations</option>
              {destinations.map(dest => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="input-field w-full"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <button onClick={exportToCSV} className="btn-outline-maroon py-2 px-4 text-sm">
              📥 Export CSV
            </button>
            <button onClick={generatePDFReport} className="btn-outline-maroon py-2 px-4 text-sm">
              📄 Generate PDF Report
            </button>
            <button onClick={exportPaymentsToCSV} className="btn-outline-maroon py-2 px-4 text-sm">
              💳 Export Payments
            </button>
          </div>
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
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Showing {filteredUsers.length} of {users.length} travelers</p>
            </div>
            
            <div className="glass-card-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["Name", "Email", "Destination", "Provider", "Required", "Paid", "Progress", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left p-3 text-xs text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => {
                      const required = u.selectedPlan?.price || 0;
                      const paid = u.totalPaid || 0;
                      const pct = required > 0 ? Math.round((paid / required) * 100) : 0;
                      const status = pct >= 100 ? "Fully Paid" : pct > 0 ? "Saving" : "Not Started";
                      
                      return (
                        <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors">
                          <td className="p-3 text-sm font-semibold text-foreground">{u.firstName} {u.lastName}</td>
                          <td className="p-3 text-xs text-muted-foreground">{u.email}</td>
                          <td className="p-3 text-sm text-muted-foreground">{u.destination || 'N/A'}</td>
                          <td className="p-3 text-xs text-muted-foreground">{u.selectedPlan?.name || 'N/A'}</td>
                          <td className="p-3 text-sm text-foreground">${required}</td>
                          <td className="p-3 text-sm font-semibold text-primary">${paid}</td>
                          <td className="p-3">
                            <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                              <div className="h-full gradient-maroon rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{pct}%</span>
                          </td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              status === "Fully Paid" ? "bg-green-100 text-green-800" :
                              status === "Saving" ? "bg-yellow-100 text-yellow-800" :
                              "bg-secondary text-muted-foreground"
                            }`}>{status}</span>
                          </td>
                          <td className="p-3">
                            <button 
                              onClick={() => { setSelectedUser(u); setShowUserDetailsModal(true); }}
                              className="text-xs px-2 py-1 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            >
                              👁️ View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payment Logs Tab */}
        {activeTab === "payments" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Showing {filteredPayments.length} of {payments.length} payments</p>
            </div>
            
            <div className="glass-card-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["Date", "User", "Email", "Amount", "Method", "Status"].map(h => (
                        <th key={h} className="text-left p-4 text-xs text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((p, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="p-4 text-sm text-foreground">{new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                        <td className="p-4 text-sm font-semibold text-foreground">{p.user?.firstName} {p.user?.lastName}</td>
                        <td className="p-4 text-xs text-muted-foreground">{p.user?.email}</td>
                        <td className="p-4 text-sm font-semibold text-primary">${p.amount}</td>
                        <td className="p-4 text-sm text-muted-foreground">{p.metadata?.method || 'Online Payment'}</td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${p.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab - same as before */}
        {activeTab === "revenue" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
            <div className="glass-card-elevated p-6">
              <h3 className="font-serif text-lg font-bold text-foreground mb-4">Revenue Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Collected</span><span className="font-bold text-foreground">${totalRevenue.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Expected</span><span className="font-bold text-foreground">${totalRequired.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Outstanding</span><span className="font-bold text-foreground">${(totalRequired - totalRevenue).toLocaleString()}</span></div>
                <div className="border-t border-border pt-3 flex justify-between"><span className="text-sm text-muted-foreground">Commission (5%)</span><span className="font-bold text-primary">${Math.round(totalRevenue * 0.05).toLocaleString()}</span></div>
              </div>
            </div>
            <div className="glass-card-elevated p-6">
              <h3 className="font-serif text-lg font-bold text-foreground mb-4">Provider Revenue</h3>
              <div className="space-y-3">
                {insurancePlans.map(plan => {
                  const planRevenue = filteredUsers
                    .filter(u => u.selectedPlanId === plan.id)
                    .reduce((s, u) => s + (u.totalPaid || 0), 0);
                  const planUsers = filteredUsers.filter(u => u.selectedPlanId === plan.id).length;
                  return (
                    <div key={plan.id} className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-foreground font-medium">{plan.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({planUsers} users)</span>
                      </div>
                      <span className="font-semibold text-foreground">${planRevenue.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Insurance Plans Tab - same as before but with better layout */}
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

        {/* Add Plan Modal - same as before */}
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

        {/* User Details Modal */}
        {showUserDetailsModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card-elevated p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-xl font-bold text-foreground">User Details</h3>
                <button onClick={() => setShowUserDetailsModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold text-foreground">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold text-foreground">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="font-semibold text-foreground">{selectedUser.destination || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Travel Date</p>
                    <p className="font-semibold text-foreground">{selectedUser.travelDate ? new Date(selectedUser.travelDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Purpose</p>
                    <p className="font-semibold text-foreground capitalize">{selectedUser.purpose || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-2">Insurance Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Provider</p>
                      <p className="font-semibold text-foreground">{selectedUser.selectedPlan?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Plan Price</p>
                      <p className="font-semibold text-primary">${selectedUser.selectedPlan?.price || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Paid</p>
                      <p className="font-semibold text-primary">${selectedUser.totalPaid || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className="font-semibold text-foreground">${(selectedUser.selectedPlan?.price || 0) - (selectedUser.totalPaid || 0)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-2">Payment History</h4>
                  <div className="space-y-2">
                    {selectedUser.payments && selectedUser.payments.length > 0 ? (
                      selectedUser.payments.map((payment: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-2 glass-card">
                          <div>
                            <p className="text-sm font-semibold text-foreground">${payment.amount}</p>
                            <p className="text-xs text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Completed</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No payments yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
