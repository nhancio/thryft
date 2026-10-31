import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle2,
  Package,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { SignInDialog } from "@/components/SignInDialog";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { createOrder, markOrderPaid, cancelOrder } from "@/lib/orders";
import type { ShippingAddress } from "@/lib/orders";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const totalShipping = items.reduce(
    (sum, item) => sum + item.product.shippingCost,
    0
  );
  const grandTotal = totalPrice + totalShipping;

  /** Collect form fields into a ShippingAddress object. */
  function getShippingAddress(): ShippingAddress | null {
    const form = formRef.current;
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return null;
    }
    const fd = new FormData(form);
    return {
      firstName: (fd.get("firstName") as string).trim(),
      lastName: (fd.get("lastName") as string).trim(),
      email: (fd.get("email") as string).trim(),
      phone: (fd.get("phone") as string).trim(),
      address: (fd.get("address") as string).trim(),
      city: (fd.get("city") as string).trim(),
      state: (fd.get("state") as string).trim(),
      pincode: (fd.get("pincode") as string).trim(),
      country: (fd.get("country") as string).trim(),
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowSignIn(true);
      return;
    }

    const shippingAddress = getShippingAddress();
    if (!shippingAddress) return;

    setIsProcessing(true);

    // Create one order per cart item
    const orderIds: string[] = [];
    try {
      for (const item of items) {
        const result = await createOrder({
          productId: item.product.id,
          amount: item.product.price * item.quantity + item.product.shippingCost,
          shippingAddress,
        });
        if ("error" in result) {
          toast.error(`Failed to create order: ${result.error}`);
          setIsProcessing(false);
          return;
        }
        orderIds.push(result.id);
      }

      // Build description for Razorpay
      const description =
        items.length === 1
          ? items[0].product.title
          : `${items.length} items from Thryft`;

      // Open Razorpay checkout
      const paymentResult = await openRazorpayCheckout({
        amount: grandTotal,
        productName: description,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      });

      // Mark all orders as paid
      for (const orderId of orderIds) {
        await markOrderPaid({
          orderId,
          razorpayPaymentId: paymentResult.razorpay_payment_id,
          razorpayOrderId: paymentResult.razorpay_order_id,
          razorpaySignature: paymentResult.razorpay_signature,
        });
      }

      // Invalidate orders cache so profile shows them
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      setOrderPlaced(true);
      clearCart();
      toast.success("Payment successful! Order confirmed.");
    } catch (err) {
      // Payment was cancelled or failed -- cancel the pending orders
      for (const orderId of orderIds) {
        await cancelOrder(orderId);
      }
      const message = err instanceof Error ? err.message : "Payment failed";
      if (message !== "Payment cancelled") {
        toast.error(message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for shopping at Thryft. Your thrift finds are on
              their way! You'll receive an email confirmation shortly.
            </p>
            <div className="space-y-3">
              <Button variant="hero" size="lg" className="w-full" asChild>
                <Link to="/browse">Continue Shopping</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/profile?tab=purchases">View Orders</Link>
              </Button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-4">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Add some thrift finds to your bag before checking out.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/browse">Start Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} onSignIn={signInWithGoogle} />

      <main className="container py-6">
        {/* Back Link */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Shipping Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      defaultValue={user?.email ?? ""}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Street address"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="City"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="State"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="400001"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="India"
                      defaultValue="India"
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment
                </h2>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium text-primary">
                    Razorpay Secure Payment
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    UPI, cards, net banking, wallets -- all payment methods supported.
                    You'll be redirected to Razorpay's secure checkout.
                  </p>
                </div>
              </motion.div>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                    Processing...
                  </span>
                ) : (
                  `Pay Now · ₹${grandTotal.toLocaleString()}`
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 p-6 rounded-2xl border border-border bg-card"
            >
              <h2 className="font-display font-bold text-lg mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.product.size} · Qty: {item.quantity}
                      </p>
                      <p className="font-bold text-sm mt-1">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{totalShipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Secure checkout · Buyer protection included</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
