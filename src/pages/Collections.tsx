import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORY_FILTERS } from "@/types/product";

const CATEGORY_IMAGES: Record<string, string> = {
  iPhone: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800",
  MacBook: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
  Watch: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800",
};

const Collections = () => {
  const { products, categoryCounts } = useProducts();
  const categoryCards = CATEGORY_FILTERS.filter((c) => c.name !== "All");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Categories
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse by category. iPhone, MacBook, Watch and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid - from Supabase counts */}
      <section className="pb-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {categoryCards.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/browse?category=${cat.name}`}
                  className="group block relative rounded-3xl overflow-hidden aspect-[16/9]"
                >
                  <img
                    src={CATEGORY_IMAGES[cat.name] ?? ""}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-background mb-2">
                      {cat.name}
                    </h2>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-background/70">
                        {categoryCounts[cat.name] ?? 0} items
                      </span>
                      <span className="flex items-center gap-2 text-sm font-medium text-background group-hover:gap-3 transition-all">
                        Explore
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured from Collections */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">
                Featured Picks
              </h2>
              <p className="text-muted-foreground mt-1">
                Top items from our collections
              </p>
            </div>
            <Link to="/browse">
              <span className="flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
                See all
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collections;
