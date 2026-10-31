import { useState, useMemo } from "react";
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
  Pencil,
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
import { openRazorpayCheckout } from "@/lib/razorpay";
import { createOrder, markOrderPaid, cancelOrder } from "@/lib/orders";
import { SignInDialog } from "@/components/SignInDialog";
import { conditionVariant, conditionLabel, handleImgError } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProductDetail() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [signInPromptOpen, setSignInPromptOpen] = useState(false);
  const [bookVisitOpen, setBookVisitOpen] = useState(false);
  const [bookVisitStep, setBookVisitStep] = useState<1 | 2 | 3>(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [visitAddress, setVisitAddress] = useState("");

  const { product: foundProduct, isLoading } = useProduct(id);
  const product = foundProduct ?? null;
  const { user, signInWithGoogle } = useAuth();
  const { isSaved, toggleSave } = useSavedProducts(user?.id);
  const queryClient = useQueryClient();

  const visitSlots = useMemo(() => {
    const slots: string[] = [];
    const now = new Date();
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() + d);
      const dayStr = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
      ["10:00 AM", "2:00 PM", "5:00 PM"].forEach((time) => {
        slots.push(`${dayStr}, ${time}`);
      });
    }
    return slots;
  }, []);

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

  const requireAuth = (action: () => void) => {
    if (!user) {
      setSignInPromptOpen(true);
      return;
    }
    action();
  };

  const handleBuyFull = () => {
    requireAuth(async () => {
      // Create a pending order
      const orderResult = await createOrder({
        productId: product.id,
        amount: product.price + product.shippingCost,
        shippingAddress: {
          firstName: user?.user_metadata?.full_name?.split(" ")[0] ?? "",
          lastName: user?.user_metadata?.full_name?.split(" ").slice(1).join(" ") ?? "",
          email: user?.email ?? "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
      });
      if ("error" in orderResult) {
        toast.error(`Failed to create order: ${orderResult.error}`);
        return;
      }

      try {
        const result = await openRazorpayCheckout({
          amount: product.price + product.shippingCost,
          productName: product.title,
          email: user?.email ?? "",
          name: user?.user_metadata?.full_name ?? "",
        });
        await markOrderPaid({
          orderId: orderResult.id,
          razorpayPaymentId: result.razorpay_payment_id,
          razorpayOrderId: result.razorpay_order_id,
          razorpaySignature: result.razorpay_signature,
        });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        toast.success("Payment successful! Order confirmed.");
      } catch (err: unknown) {
        await cancelOrder(orderResult.id);
        const msg = err instanceof Error ? err.message : "Payment failed";
        if (msg !== "Payment cancelled") toast.error(msg);
      }
    });
  };

  const handleBookVisitClick = () => {
    requireAuth(() => {
      setSelectedSlot(null);
      setVisitAddress("");
      setBookVisitStep(1);
      setBookVisitOpen(true);
    });
  };

  const handleBookVisitPayment = async () => {
    if (!selectedSlot || !visitAddress.trim()) return;
    try {
      const result = await openRazorpayCheckout({
        amount: 1000,
        productName: `Book visit — ${product.title}`,
        email: user?.email ?? "",
        name: user?.user_metadata?.full_name ?? "",
      });
      toast.success(`Booking confirmed! ID: ${result.razorpay_payment_id}`);
      setBookVisitOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg !== "Payment cancelled") toast.error(msg);
    }
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
          {/* LEFT: Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <div className="relative w-[80%] max-w-lg aspect-square sm:aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={product.images[currentImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={handleImgError}
                />

                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="glass"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="glass"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10"
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
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide justify-center">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      currentImage === i ? "border-primary ring-2 ring-primary/30" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={handleImgError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info + Actions */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <div className="flex flex-wrap items-start gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold mb-1 flex-1 min-w-0">
                  {product.title}
                </h1>
                {user?.id === product.listedByUid && (
                  <Link to={`/sell/edit/${product.id}`}>
                    <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                      <Pencil className="w-3.5 h-3.5" />
                      Edit listing
                    </Button>
                  </Link>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <div className="flex items-baseline gap-2 mt-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold">{"\u20B9"}{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-base sm:text-lg text-muted-foreground line-through">
                      {"\u20B9"}{product.originalPrice.toLocaleString()}
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

            {/* ACTION BUTTONS */}
            <div className="hidden lg:block space-y-3">
              {product.status === "live" && (
                <div className="flex flex-col gap-2.5">
                  <Button variant="hero" size="lg" className="w-full shadow-lg text-sm" onClick={handleBuyFull}>
                    Buy now · {"\u20B9"}{product.price.toLocaleString()}
                  </Button>
                  <Button variant="outline" size="lg" className="w-full text-sm" onClick={handleBookVisitClick}>
                    Pay {"\u20B9"}1,000 and book visit (fully refundable)
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
                    {product.shippingCost === 0 ? "Free" : `\u20B9${product.shippingCost}`} · Estimated 3-5 days
                  </div>
                </div>
              </div>
              {product.localPickup && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Local Pickup</div>
                    <div className="text-xs text-muted-foreground">Available for local pickup</div>
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

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur border-t border-border z-40 lg:hidden safe-bottom">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          {product.status === "live" && (
            <>
              <Button variant="hero" size="default" className="flex-1 shadow-lg text-xs sm:text-sm" onClick={handleBuyFull}>
                Buy now · {"\u20B9"}{product.price.toLocaleString()}
              </Button>
              <Button variant="outline" size="default" className="flex-1 text-xs sm:text-sm" onClick={handleBookVisitClick}>
                Book visit · {"\u20B9"}1,000
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

      {/* Book visit: slot -> address -> payment */}
      <Dialog open={bookVisitOpen} onOpenChange={(open) => { setBookVisitOpen(open); if (!open) setBookVisitStep(1); }}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book a visit</DialogTitle>
            <DialogDescription>
              {bookVisitStep === 1 && "Choose a time slot for your visit."}
              {bookVisitStep === 2 && "Enter the address where you want the visit."}
              {bookVisitStep === 3 && "Review and pay \u20B91,000 (fully refundable)."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {bookVisitStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {visitSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                      selectedSlot === slot ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
            {bookVisitStep === 2 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  placeholder="Full address for the visit"
                  value={visitAddress}
                  onChange={(e) => setVisitAddress(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
            )}
            {bookVisitStep === 3 && (
              <div className="rounded-xl border border-border p-4 space-y-2 text-sm">
                <p><span className="text-muted-foreground">Slot:</span> {selectedSlot}</p>
                <p><span className="text-muted-foreground">Address:</span> {visitAddress}</p>
                <p className="font-semibold pt-2">Amount: {"\u20B9"}1,000 (refundable)</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex-row gap-2 sm:gap-2">
            {bookVisitStep > 1 ? (
              <Button variant="outline" className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0" onClick={() => setBookVisitStep((s) => (s - 1) as 1 | 2 | 3)}>
                Back
              </Button>
            ) : (
              <div className="flex-1" />
            )}
            {bookVisitStep < 3 ? (
              <Button
                variant="hero"
                className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0"
                onClick={() => setBookVisitStep((s) => (s + 1) as 1 | 2 | 3)}
                disabled={bookVisitStep === 1 ? !selectedSlot : bookVisitStep === 2 ? !visitAddress.trim() : false}
              >
                Next
              </Button>
            ) : (
              <Button variant="hero" className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0" onClick={handleBookVisitPayment}>
                Pay {"\u20B9"}1,000
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
      <SignInDialog
        open={signInPromptOpen}
        onOpenChange={setSignInPromptOpen}
        onSignIn={signInWithGoogle}
      />

      <Footer />
    </div>
  );
}
