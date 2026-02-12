import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
      className="w-full"
    >
      <Link to={`/product/${product.id}`} className="block group">
        <div className="feed-card rounded-xl overflow-hidden border border-border/50 bg-card">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges top-left */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <Badge variant={conditionVariant[product.condition]} className="text-[10px] px-1.5 py-0">
                {conditionLabel[product.condition]}
              </Badge>
              {product.era && (
                <Badge variant="era" className="text-[10px] px-1.5 py-0">{product.era}</Badge>
              )}
            </div>

            {/* Status badge top-right */}
            {product.status === "sold" ? (
              <Badge className="absolute top-2 right-2 bg-foreground text-background text-[10px]">
                Sold out
              </Badge>
            ) : product.status === "hold" ? (
              <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-[10px]">
                On hold
              </Badge>
            ) : discount ? (
              <Badge variant="sale" className="absolute top-2 right-2 text-[10px]">
                -{discount}%
              </Badge>
            ) : null}

            {/* Notify me for hold */}
            {product.status === "hold" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="glass"
                    size="sm"
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2.5 text-[10px] font-medium h-7"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  >
                    Notify me
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Get notified</DialogTitle>
                    <DialogDescription>
                      Please provide your number to get updates when this item is available.
                    </DialogDescription>
                  </DialogHeader>
                  <Input type="tel" placeholder="Enter your phone number" />
                  <DialogFooter className="mt-4">
                    <Button className="w-full">Submit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Hover stats */}
            {product.status !== "sold" && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3 text-background text-xs">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{product.likes}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{product.views}</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <img src={product.seller.avatar} alt="" className="w-4 h-4 rounded-full shrink-0" />
              <span className="text-[11px] text-muted-foreground truncate">{product.seller.username}</span>
              {product.seller.verified && (
                <Badge variant="verified" className="text-[9px] px-1 py-0 shrink-0">✓</Badge>
              )}
            </div>
            <h3 className="font-medium text-xs sm:text-sm leading-tight line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="font-bold text-sm sm:text-base">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.status !== "sold" && (
                  <span className="text-[10px] sm:text-xs text-muted-foreground line-through truncate">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full shrink-0">
                {product.size}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
