import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/useOrders";
import { handleImgError, PLACEHOLDER_IMG } from "@/lib/constants";
import type { OrderStatus } from "@/lib/orders";

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: typeof Clock; color: string }
> = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Paid", icon: CheckCircle2, color: "bg-green-100 text-green-700" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-blue-100 text-blue-700" },
  delivered: { label: "Delivered", icon: Package, color: "bg-primary/10 text-primary" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-700" },
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground mb-4">Order not found.</p>
          <Button variant="hero" asChild>
            <Link to="/profile?tab=purchases">Back to Orders</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const config = statusConfig[order.status];
  const StatusIcon = config.icon;
  const addr = order.shipping_address;
  const productImage =
    order.product?.images?.[0] ?? PLACEHOLDER_IMG;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 max-w-3xl">
        <Link
          to="/profile?tab=purchases"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold">Order Details</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Order ID: {order.id.slice(0, 8)}...
              </p>
              <p className="text-sm text-muted-foreground">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge className={`${config.color} px-3 py-1.5 text-sm`}>
              <StatusIcon className="w-4 h-4 mr-1.5" />
              {config.label}
            </Badge>
          </div>

          {/* Product */}
          <div className="p-5 rounded-2xl border border-border bg-card">
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Item
            </h2>
            <Link
              to={`/product/${order.product_id}`}
              className="flex gap-4 group"
            >
              <img
                src={productImage}
                alt={order.product?.title ?? "Product"}
                className="w-20 h-24 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                onError={handleImgError}
              />
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors">
                  {order.product?.title ?? "Product"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.product?.brand} · {order.product?.category}
                </p>
                <p className="font-bold text-lg mt-2">
                  {"\u20B9"}{order.amount.toLocaleString()}
                </p>
              </div>
            </Link>
          </div>

          {/* Payment Info */}
          {order.razorpay_payment_id && (
            <div className="p-5 rounded-2xl border border-border bg-card">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-xs">
                    {order.razorpay_payment_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold">
                    {"\u20B9"}{order.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {addr.firstName && (
            <div className="p-5 rounded-2xl border border-border bg-card">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Shipping Address
              </h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {addr.firstName} {addr.lastName}
                </p>
                <p className="text-muted-foreground">{addr.address}</p>
                <p className="text-muted-foreground">
                  {addr.city}, {addr.state} {addr.pincode}
                </p>
                <p className="text-muted-foreground">{addr.country}</p>
                <p className="text-muted-foreground mt-2">
                  {addr.phone} · {addr.email}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
