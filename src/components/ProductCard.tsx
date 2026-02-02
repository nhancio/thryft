import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { Product } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const conditionVariant = {
  new: "condition-new",
  "like-new": "condition-like-new",
  "gently-used": "condition-gently-used",
  worn: "condition-worn",
} as const;

const conditionLabel = {
  new: "New",
  "like-new": "Like New",
  "gently-used": "Gently Used",
  worn: "Worn",
} as const;

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/product/${product.id}`} className="block group">
        <div className="feed-card">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Overlay badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Badge variant={conditionVariant[product.condition]}>
                {conditionLabel[product.condition]}
              </Badge>
              {product.era && (
                <Badge variant="era">{product.era}</Badge>
              )}
            </div>

            {/* Discount badge */}
            {discount && (
              <Badge variant="sale" className="absolute top-3 right-3">
                -{discount}%
              </Badge>
            )}

            {/* Quick stats overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-4 text-background text-sm">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {product.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {product.views}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Seller */}
            <div className="flex items-center gap-2 mb-2">
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-xs text-muted-foreground truncate">
                {product.seller.username}
              </span>
              {product.seller.verified && (
                <Badge variant="verified" className="text-[10px] px-1.5 py-0">
                  ✓
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {/* Price and size */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {product.size}
              </span>
            </div>

            {/* Brand */}
            <p className="text-xs text-muted-foreground mt-2 truncate">
              {product.brand}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
