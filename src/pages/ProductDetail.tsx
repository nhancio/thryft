import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Share2,
  Truck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Package,
  Ruler,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProduct } from "@/hooks/useProducts";
import { useSavedProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const conditionVariant = {
  new: "condition-new",
  "like-new": "condition-like-new",
  "gently-used": "condition-gently-used",
  worn: "condition-worn",
} as const;

const conditionLabel = {
  new: "New with tags",
  "like-new": "Like New",
  "gently-used": "Gently Used",
  worn: "Well Loved",
} as const;

export default function ProductDetail() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [signInPromptOpen, setSignInPromptOpen] = useState(false);

  const { product: foundProduct, isLoading } = useProduct(id);
  const product = foundProduct ?? null;
  const { user, signInWithGoogle } = useAuth();
  const { isSaved, toggleSave } = useSavedProducts(user?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  if (!product) {
    return <Navigate to="/browse" replace />;
  }

  const isLiked = isSaved(product.id);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  /** Gate actions behind sign-in */
  const requireAuth = (action: () => void) => {
    if (!user) {
      setSignInPromptOpen(true);
      return;
    }
    action();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const handleSave = () => {
    requireAuth(() => {
      toggleSave(product.id);
      toast.success(isLiked ? "Removed from saved" : "Saved!");
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-4 md:py-6 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-4 md:mb-6">
          <Link to="/browse" className="hover:text-foreground">Shop</Link>
          {" / "}
          <Link to={`/browse?category=${product.category}`} className="hover:text-foreground">{product.category}</Link>
          {" / "}
          <span className="text-foreground">{product.brand}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 pb-28 lg:pb-8">
          {/* ── LEFT: Image Gallery ── */}
          <div className="space-y-3">
            <div className="relative aspect-square sm:aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <motion.img
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[currentImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {product.images.length > 1 && (
                <>
                  <Button
                    variant="glass"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="glass"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground/70 text-background px-2.5 py-0.5 rounded-full text-xs">
                {currentImage + 1} / {product.images.length}
              </div>

              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <Badge variant={conditionVariant[product.condition]}>
                  {conditionLabel[product.condition]}
                </Badge>
                {product.era && <Badge variant="era">{product.era}</Badge>}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      currentImage === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info + Actions ── */}
          <div className="space-y-6">
            {/* Listed by */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              {product.seller.avatar ? (
                <img src={product.seller.avatar} alt={product.seller.name} className="w-10 h-10 rounded-full shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                  {product.seller.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-sm truncate block">{product.seller.name}</span>
                {product.seller.location && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {product.seller.location}
                  </span>
                )}
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold mb-1">
                {product.title}
              </h1>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <div className="flex items-baseline gap-2 mt-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-base sm:text-lg text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="sale">-{discount}%</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50">
                <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-medium">Size</div>
                  <div className="text-xs text-muted-foreground truncate">{product.size}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50">
                <Ruler className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-medium">Condition</div>
                  <div className="text-xs text-muted-foreground truncate">{conditionLabel[product.condition]}</div>
                </div>
              </div>
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div className="hidden lg:block space-y-3">
              {product.status === "live" && (
                <div className="flex flex-col gap-2.5">
                  <Button variant="hero" size="lg" className="w-full shadow-lg text-sm" onClick={() => requireAuth(() => toast.info("Payment flow coming soon"))}>
                    Pay Full at ₹1,000 discount
                  </Button>
                  <Button variant="outline" size="lg" className="w-full text-sm" onClick={() => requireAuth(() => toast.info("Booking flow coming soon"))}>
                    Pay ₹1,000 and book visit (fully refundable)
                  </Button>
                </div>
              )}
              {product.status === "hold" && (
                <Button variant="hero" size="lg" className="w-full shadow-lg" onClick={() => requireAuth(() => setNotifyOpen(true))}>
                  Notify me when available
                </Button>
              )}
              {product.status === "sold" && (
                <Button variant="secondary" size="lg" className="w-full" disabled>
                  Sold out
                </Button>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={handleSave}>
                  <Heart className={`w-4 h-4 mr-1.5 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
                  {isLiked ? "Saved" : "Save"}
                </Button>
                <Button variant="ghost" size="icon" className="shrink-0" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Shipping */}
            <div className="space-y-2.5 p-4 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-sm font-medium">Shipping</div>
                  <div className="text-xs text-muted-foreground">
                    {product.shippingCost === 0 ? "Free" : `₹${product.shippingCost}`} · Estimated 3-5 days
                  </div>
                </div>
              </div>
              {product.localPickup && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Local Pickup</div>
                    <div className="text-xs text-muted-foreground">Available in {product.seller.location}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">About this item</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Measurements */}
            {product.measurements && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Measurements</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(["chest", "length", "waist", "inseam"] as const).map((key) =>
                    product.measurements?.[key] ? (
                      <div key={key} className="flex justify-between p-2.5 bg-muted/50 rounded-lg text-sm">
                        <span className="text-muted-foreground capitalize">{key}</span>
                        <span className="font-medium">{product.measurements[key]} {product.measurements.unit}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── MOBILE STICKY BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur border-t border-border z-40 lg:hidden">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          {product.status === "live" && (
            <>
              <Button variant="hero" size="default" className="flex-1 shadow-lg text-xs sm:text-sm" onClick={() => requireAuth(() => toast.info("Payment flow coming soon"))}>
                Pay Full · ₹1,000 off
              </Button>
              <Button variant="outline" size="default" className="flex-1 text-xs sm:text-sm" onClick={() => requireAuth(() => toast.info("Booking flow coming soon"))}>
                Book visit · ₹1,000
              </Button>
            </>
          )}
          {product.status === "hold" && (
            <Button variant="hero" size="default" className="flex-1 shadow-lg" onClick={() => requireAuth(() => setNotifyOpen(true))}>
              Notify me
            </Button>
          )}
          {product.status === "sold" && (
            <Button variant="secondary" size="default" className="flex-1" disabled>
              Sold out
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleSave}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Notify dialog */}
      <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Get notified</DialogTitle>
            <DialogDescription>
              Please provide your number to get updates when this item is available.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <DialogFooter className="mt-2">
            <Button
              className="w-full"
              onClick={() => {
                setNotifyOpen(false);
                setPhoneNumber("");
                toast.success("We'll notify you with future drops.");
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sign-in prompt dialog */}
      <Dialog open={signInPromptOpen} onOpenChange={setSignInPromptOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              Please sign in to continue. It takes just a few seconds.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button
              variant="hero"
              className="w-full gap-2"
              onClick={() => {
                setSignInPromptOpen(false);
                signInWithGoogle();
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Login with Google
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
