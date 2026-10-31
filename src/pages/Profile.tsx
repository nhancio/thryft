import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Package,
  CreditCard,
  TrendingUp,
  ShoppingBag,
  Plus,
  LogOut,
  Pencil,
  Trash2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProducts, useSavedProducts } from "@/hooks/useProducts";
import { useUserOrders } from "@/hooks/useOrders";
import { handleImgError, PLACEHOLDER_IMG } from "@/lib/constants";
import type { OrderStatus } from "@/lib/orders";
import { deleteProductListing } from "@/lib/supabase-products";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const tabs = [
  { id: "closet", label: "My Listings", icon: Package },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "purchases", label: "Purchases", icon: ShoppingBag },
  { id: "stats", label: "Stats", icon: TrendingUp },
];

export default function Profile() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "closet");
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);
  const { user, signInWithGoogle, signOut, authError } = useAuth();
  const { products } = useProducts();
  const { savedIds } = useSavedProducts(user?.id);
  const { data: orders = [] } = useUserOrders(user?.id);
  const queryClient = useQueryClient();

  const handleDelete = async (productId: string, title: string) => {
    if (!user) return;
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    await queryClient.cancelQueries({ queryKey: ["products"] });
    const previousProducts = queryClient.getQueryData<typeof products>(["products"]);
    queryClient.setQueryData<typeof products>(["products"], (current = []) =>
      current.filter((product) => product.id !== productId)
    );
    queryClient.removeQueries({ queryKey: ["product", productId], exact: true });

    const result = await deleteProductListing(productId, user.id);
    if ("error" in result) {
      queryClient.setQueryData(["products"], previousProducts);
      toast.error(result.error);
    } else {
      toast.success("Listing deleted");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };
  const savedProducts = products.filter((p) => savedIds.includes(p.id));

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          {authError && (
            <p className="text-destructive mb-4 text-sm max-w-md mx-auto">
              Sign-in failed. Please try again. If it keeps failing, the app may need its Google sign-in settings updated.
            </p>
          )}
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
            <img
              src={avatarUrl}
              alt={displayName}
              loading="lazy"
              decoding="async"
              className="w-24 h-24 rounded-full"
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.dataset.fallback) {
                  t.dataset.fallback = "1";
                  t.style.display = "none";
                }
              }}
            />
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
            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: CreditCard, label: "Wallet Points", value: "0", color: "bg-primary/10 text-primary" },
            { icon: Package, label: "Active Listings", value: String(products.filter((p) => p.listedByUid === user.id).length), color: "bg-accent/10 text-accent" },
            { icon: ShoppingBag, label: "Orders", value: String(orders.length), color: "bg-sage/20 text-foreground" },
            { icon: Heart, label: "Saved Items", value: String(savedIds.length), color: "bg-peach-soft text-accent" },
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
                    className="group relative"
                  >
                    <Link to={`/product/${product.id}`}>
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-2">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={handleImgError}
                        />
                        <Badge className="absolute top-2 right-2 capitalize">{product.status}</Badge>
                      </div>
                      <h3 className="text-sm font-medium truncate">{product.title}</h3>
                      <p className="font-semibold">{"\u20B9"}{product.price.toLocaleString()}</p>
                    </Link>
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Link
                        to={`/sell/edit/${product.id}`}
                        className="rounded-lg bg-background/90 hover:bg-background p-2 shadow-sm border border-border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <button
                        className="rounded-lg bg-background/90 hover:bg-destructive/10 p-2 shadow-sm border border-border"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(product.id, product.title); }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          savedProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No saved items yet. Browse and save items you like.</p>
              <Link to="/browse"><Button variant="outline" size="sm" className="mt-4">Browse items</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {savedProducts.map((product, i) => (
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
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={handleImgError}
                      />
                      <Badge className="absolute top-2 right-2 capitalize">{product.status}</Badge>
                    </div>
                    <h3 className="text-sm font-medium truncate">{product.title}</h3>
                    <p className="font-semibold">{"\u20B9"}{product.price.toLocaleString()}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )
        )}

        {activeTab === "purchases" && (
          orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No purchases yet.</p>
              <Link to="/browse"><Button variant="outline" size="sm" className="mt-4">Start shopping</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, i) => {
                const statusColors: Record<OrderStatus, string> = {
                  pending: "bg-yellow-100 text-yellow-700",
                  paid: "bg-green-100 text-green-700",
                  shipped: "bg-blue-100 text-blue-700",
                  delivered: "bg-primary/10 text-primary",
                  cancelled: "bg-red-100 text-red-700",
                };
                const productImg = order.product?.images?.[0] ?? PLACEHOLDER_IMG;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={`/orders/${order.id}`}
                      className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <img
                        src={productImg}
                        alt={order.product?.title ?? "Product"}
                        className="w-16 h-20 object-cover rounded-lg"
                        onError={handleImgError}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {order.product?.title ?? "Product"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm">{"\u20B9"}{order.amount.toLocaleString()}</span>
                          <Badge className={`${statusColors[order.status]} text-xs capitalize`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <h2 className="font-semibold">Your Stats</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl bg-muted/30 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{"\u20B9"}0</div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/30 text-center">
                <div className="text-3xl font-bold mb-1">{products.filter((p) => p.listedByUid === user.id && p.status === "sold").length}</div>
                <div className="text-sm text-muted-foreground">Items Sold</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
