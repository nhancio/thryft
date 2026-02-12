import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Package,
  Settings,
  CreditCard,
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
  const { user, signInWithGoogle } = useAuth();
  const { products } = useProducts();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <p className="text-muted-foreground mb-4">Sign in to view your profile.</p>
          <Button variant="hero" onClick={() => signInWithGoogle()}>Login with Google</Button>
        </main>
        <Footer />
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
            <h1 className="text-2xl font-display font-bold">{displayName}</h1>
            <p className="text-muted-foreground">{email}</p>
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
            { icon: Package, label: "Active Listings", value: String(products.filter((p) => p.listedByUid === user.id).length), color: "bg-accent/10 text-accent" },
            { icon: ShoppingBag, label: "Pending Orders", value: "0", color: "bg-sage/20 text-foreground" },
            { icon: Heart, label: "Saved Items", value: "0", color: "bg-peach-soft text-accent" },
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
                  Add new <Plus className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            {products.filter((p) => p.listedByUid === user.id).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>You haven't listed any items yet.</p>
                <Link to="/sell"><Button variant="hero" size="sm" className="mt-4">List your first item</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.filter((p) => p.listedByUid === user.id).map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                    <Link to={`/product/${product.id}`}>
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-2">
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <Badge className="absolute top-2 right-2 capitalize">{product.status}</Badge>
                      </div>
                      <h3 className="text-sm font-medium truncate">{product.title}</h3>
                      <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{product.views} views</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No saved items yet. Browse and save items you like.</p>
            <Link to="/browse"><Button variant="outline" size="sm" className="mt-4">Browse items</Button></Link>
          </div>
        )}

        {activeTab === "purchases" && (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No purchases yet.</p>
            <Link to="/browse"><Button variant="outline" size="sm" className="mt-4">Start shopping</Button></Link>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <h2 className="font-semibold">Your Stats</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl bg-muted/30 text-center">
                <div className="text-3xl font-bold text-primary mb-1">₹0</div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/30 text-center">
                <div className="text-3xl font-bold mb-1">{products.filter((p) => p.listedByUid === user.id && p.status === "sold").length}</div>
                <div className="text-sm text-muted-foreground">Items Sold</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/30 text-center">
                <div className="text-3xl font-bold mb-1">{products.filter((p) => p.listedByUid === user.id).reduce((sum, p) => sum + p.views, 0)}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
