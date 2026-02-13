import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, Share2 } from "lucide-react";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSavedProducts } from "@/hooks/useProducts";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
  const { user, signInWithGoogle } = useAuth();
  const { isSaved, toggleSave } = useSavedProducts(user?.id);
  const [signInPromptOpen, setSignInPromptOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const liked = isSaved(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const requireAuth = (action: () => void) => {
    if (!user) {
      setSignInPromptOpen(true);
      return;
    }
    action();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(() => {
      toggleSave(product.id);
      toast.success(liked ? "Removed from saved" : "Saved!");
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  return (
    <>
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

              {/* Quick actions on hover */}
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ top: product.status === "sold" || product.status === "hold" || discount ? "2rem" : "0.5rem" }}>
                <Button
                  variant="glass"
                  size="icon"
                  className="w-7 h-7"
                  onClick={handleSave}
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? "fill-destructive text-destructive" : ""}`} />
                </Button>
                <Button
                  variant="glass"
                  size="icon"
                  className="w-7 h-7"
                  onClick={handleShare}
                >
                  <Share2 className="w-3.5 h-3.5" />
                </Button>
              </div>

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
                {product.seller.avatar ? (
                  <img src={product.seller.avatar} alt="" className="w-4 h-4 rounded-full shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-muted text-[8px] font-bold flex items-center justify-center shrink-0">
                    {product.seller.name.charAt(0)}
                  </div>
                )}
                <span className="text-[11px] text-muted-foreground truncate">{product.seller.name}</span>
              </div>
              <h3 className="font-medium text-xs sm:text-sm leading-tight line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <div className="flex items-center justify-between gap-2 mb-2">
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

              {/* Action buttons on card */}
              <div className="flex gap-1.5">
                {product.status === "live" && (
                  <Button
                    variant="hero"
                    size="sm"
                    className="flex-1 text-[10px] h-7 px-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      requireAuth(() => toast.info("Payment flow coming soon"));
                    }}
                  >
                    Buy now
                  </Button>
                )}
                {product.status === "hold" && (
                  <Button
                    variant="hero"
                    size="sm"
                    className="flex-1 text-[10px] h-7 px-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      requireAuth(() => setNotifyOpen(true));
                    }}
                  >
                    Notify me
                  </Button>
                )}
                {product.status === "sold" && (
                  <Button variant="secondary" size="sm" className="flex-1 text-[10px] h-7 px-2" disabled>
                    Sold out
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2"
                  onClick={handleSave}
                >
                  <Heart className={`w-3 h-3 ${liked ? "fill-destructive text-destructive" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Sign-in prompt */}
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
    </>
  );
}
