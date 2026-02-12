import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Package,
  Settings,
  CreditCard,
  Star,
  TrendingUp,
  ShoppingBag,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";

const tabs = [
  { id: "closet", label: "My Closet", icon: Package },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "purchases", label: "Purchases", icon: ShoppingBag },
  { id: "stats", label: "Stats", icon: TrendingUp },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("closet");
  const { user } = useAuth();
  const { products } = useProducts();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <p className="text-muted-foreground mb-4">Sign in to view your profile.</p>
          <Link to="/">
            <Button variant="hero">Go home</Button>
          </Link>
        </main>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "User";
  const avatarUrl = user.user_metadata?.avatar_url ?? "";
  const email = user.email ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-24 h-24 rounded-full" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-display font-bold">{displayName}</h1>
            </div>
            <p className="text-muted-foreground">{email}</p>

            {/* Stats */}
            <div className="flex gap-6 mt-4 justify-center md:justify-start">
              <div>
                <div className="font-semibold">{products.filter((p) => p.listedByUid === user.id).length}</div>
                <div className="text-sm text-muted-foreground">Listings</div>
              </div>
              <div>
                <div className="font-semibold">—</div>
                <div className="text-sm text-muted-foreground">Sales</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to="/sell">
              <Button variant="hero" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                List Item
              </Button>
            </Link>
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: CreditCard, label: "Wallet", value: "₹12,450", color: "bg-primary/10 text-primary" },
            { icon: Package, label: "Active Listings", value: "8", color: "bg-accent/10 text-accent" },
            { icon: ShoppingBag, label: "Pending Orders", value: "2", color: "bg-sage/20 text-foreground" },
            { icon: Heart, label: "Saved Items", value: "24", color: "bg-peach-soft text-accent" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="font-semibold">{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "tag"}
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "closet" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">My Listings</h2>
              <Link to="/sell">
                <Button variant="ghost" size="sm">
                  Add new
                  <Plus className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-2">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2">Active</Badge>
                    </div>
                    <h3 className="text-sm font-medium truncate">{product.title}</h3>
                    <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{product.views} views</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            <h2 className="font-semibold mb-4">Saved Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(2, 6).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-2">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center">
                        <Heart className="w-4 h-4 fill-destructive text-destructive" />
                      </button>
                    </div>
                    <h3 className="text-sm font-medium truncate">{product.title}</h3>
                    <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "purchases" && (
          <div>
            <h2 className="font-semibold mb-4">Purchase History</h2>
            <div className="space-y-3">
              {products.slice(0, 3).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Purchased from {product.seller.username}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                    <Badge variant="secondary">Delivered</Badge>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <h2 className="font-semibold">Seller Stats</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl bg-muted/30 text-center">
                <div className="text-3xl font-bold text-primary mb-1">₹45,230</div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/30 text-center">
                <div className="text-3xl font-bold mb-1">42</div>
                <div className="text-sm text-muted-foreground">Items Sold</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/30 text-center">
                <div className="text-3xl font-bold mb-1">2.3K</div>
                <div className="text-sm text-muted-foreground">Profile Views</div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border">
              <h3 className="font-semibold mb-4">This Month</h3>
              <div className="space-y-4">
                {[
                  { label: "Views", value: 456, change: "+12%" },
                  { label: "Likes", value: 89, change: "+8%" },
                  { label: "Messages", value: 23, change: "+15%" },
                  { label: "Sales", value: 7, change: "+40%" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{stat.value}</span>
                      <Badge variant="default" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
