import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Package,
  Flag,
  BarChart3,
  CreditCard,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts, mockSellers } from "@/data/mockData";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "listings", label: "Listings", icon: Package },
  { id: "flags", label: "Content Flags", icon: Flag, badge: 12 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "payouts", label: "Payouts", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Users", value: "12,453", change: "+12%", trend: "up" },
  { label: "Active Listings", value: "8,721", change: "+8%", trend: "up" },
  { label: "GMV (This Month)", value: "₹24.5L", change: "+23%", trend: "up" },
  { label: "Dispute Rate", value: "0.8%", change: "-0.2%", trend: "down" },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-50",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-xl font-display font-bold">
            <span className="text-primary">thrift</span>
            {sidebarOpen && <span>ed</span>}
          </span>
          {sidebarOpen && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Admin
            </Badge>
          )}
        </div>

        {/* Nav Items */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={activeSection === item.id ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <LayoutDashboard className="w-5 h-5" />
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users, listings..."
                className="w-80 h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="flex items-center gap-2">
              <img
                src={mockSellers[0].avatar}
                alt="Admin"
                className="w-8 h-8 rounded-full"
              />
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-display font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {stat.label}
                      </span>
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-primary" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <Badge
                      variant={stat.trend === "up" ? "default" : "secondary"}
                      className="mt-2 text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Listings */}
                <div className="rounded-xl bg-card border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold">Recent Listings</h3>
                    <Button variant="ghost" size="sm">
                      View all
                    </Button>
                  </div>
                  <div className="divide-y divide-border">
                    {mockProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {product.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            by {product.seller.username}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          ₹{product.price.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flagged Content */}
                <div className="rounded-xl bg-card border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      Flagged Content
                      <Badge variant="destructive">12</Badge>
                    </h3>
                    <Button variant="ghost" size="sm">
                      Review all
                    </Button>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      { type: "Counterfeit claim", user: "@seller123", severity: "high" },
                      { type: "Inappropriate content", user: "@fashionista", severity: "medium" },
                      { type: "Price manipulation", user: "@vintagelover", severity: "low" },
                      { type: "Spam listing", user: "@newuser42", severity: "medium" },
                    ].map((flag, i) => (
                      <div
                        key={i}
                        className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            flag.severity === "high"
                              ? "bg-destructive/10 text-destructive"
                              : flag.severity === "medium"
                              ? "bg-accent/20 text-accent"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{flag.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {flag.user}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon-sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm">
                            <Ban className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-display font-bold">Users</h1>
                  <p className="text-muted-foreground">
                    Manage user accounts and verification
                  </p>
                </div>
                <Button variant="hero">Export Users</Button>
              </div>

              <div className="rounded-xl bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">User</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Listings</th>
                      <th className="text-left p-4 font-medium text-sm">Sales</th>
                      <th className="text-left p-4 font-medium text-sm">Rating</th>
                      <th className="text-left p-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockSellers.map((seller) => (
                      <tr key={seller.id} className="hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={seller.avatar}
                              alt=""
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{seller.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {seller.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={seller.verified ? "verified" : "secondary"}>
                            {seller.verified ? "Verified" : "Unverified"}
                          </Badge>
                        </td>
                        <td className="p-4">24</td>
                        <td className="p-4">{seller.totalSales}</td>
                        <td className="p-4">{seller.rating}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              Suspend
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "listings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-display font-bold">Listings</h1>
                  <p className="text-muted-foreground">
                    Review and moderate marketplace listings
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Filter</Button>
                  <Button variant="hero">Export</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {mockProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl bg-card border border-border overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={product.images[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2">Active</Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm truncate">
                        {product.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.seller.username}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-semibold">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon-sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm">
                            <Ban className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder for other sections */}
          {!["overview", "users", "listings"].includes(activeSection) && (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold mb-2">
                {sidebarItems.find((i) => i.id === activeSection)?.label}
              </h2>
              <p className="text-muted-foreground">
                This section is under development.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
