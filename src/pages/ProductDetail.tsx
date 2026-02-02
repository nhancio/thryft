import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Share2,
  MessageCircle,
  ShieldCheck,
  Truck,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  Ruler,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";

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
  const [isLiked, setIsLiked] = useState(false);

  const product = mockProducts.find((p) => p.id === id) || mockProducts[0];
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/browse" className="hover:text-foreground">
            Shop
          </Link>{" "}
          /{" "}
          <Link
            to={`/browse?category=${product.category}`}
            className="hover:text-foreground"
          >
            {product.category}
          </Link>{" "}
          / <span className="text-foreground">{product.brand}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <motion.img
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[currentImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="glass"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="glass"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/70 text-background px-3 py-1 rounded-full text-sm">
                {currentImage + 1} / {product.images.length}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge variant={conditionVariant[product.condition]}>
                  {conditionLabel[product.condition]}
                </Badge>
                {product.era && <Badge variant="era">{product.era}</Badge>}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      currentImage === i
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Link
              to={`/seller/${product.seller.id}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{product.seller.name}</span>
                  {product.seller.verified && (
                    <Badge variant="verified" className="px-1.5 py-0">
                      <ShieldCheck className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    {product.seller.rating}
                  </span>
                  <span>{product.seller.totalSales} sales</span>
                </div>
              </div>
            </Link>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                {product.title}
              </h1>
              <p className="text-muted-foreground">{product.brand}</p>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-bold">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="sale">-{discount}%</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Size</div>
                  <div className="text-sm text-muted-foreground">
                    {product.size}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Ruler className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Condition</div>
                  <div className="text-sm text-muted-foreground">
                    {conditionLabel[product.condition]}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="hero" size="lg" className="flex-1">
                Buy Now
              </Button>
              {product.allowOffers && (
                <Button variant="outline" size="lg" className="flex-1">
                  Make Offer
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="lg"
                className="flex-1"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`w-5 h-5 mr-2 ${
                    isLiked ? "fill-destructive text-destructive" : ""
                  }`}
                />
                {isLiked ? "Saved" : "Save"}
              </Button>
              <Button variant="ghost" size="lg" className="flex-1">
                <MessageCircle className="w-5 h-5 mr-2" />
                Message
              </Button>
              <Button variant="ghost" size="icon-lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3 p-4 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Shipping</div>
                  <div className="text-sm text-muted-foreground">
                    ₹{product.shippingCost} · Estimated 3-5 days
                  </div>
                </div>
              </div>
              {product.localPickup && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Local Pickup</div>
                    <div className="text-sm text-muted-foreground">
                      Available in {product.seller.location}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-3">About this item</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Measurements */}
            {product.measurements && (
              <div>
                <h3 className="font-semibold mb-3">Measurements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.measurements.chest && (
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Chest</span>
                      <span className="font-medium">
                        {product.measurements.chest} {product.measurements.unit}
                      </span>
                    </div>
                  )}
                  {product.measurements.length && (
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Length</span>
                      <span className="font-medium">
                        {product.measurements.length}{" "}
                        {product.measurements.unit}
                      </span>
                    </div>
                  )}
                  {product.measurements.waist && (
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Waist</span>
                      <span className="font-medium">
                        {product.measurements.waist} {product.measurements.unit}
                      </span>
                    </div>
                  )}
                  {product.measurements.inseam && (
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Inseam</span>
                      <span className="font-medium">
                        {product.measurements.inseam}{" "}
                        {product.measurements.unit}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
