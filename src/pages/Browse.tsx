import { useState } from "react";
import { motion } from "framer-motion";
import { Grid3X3, LayoutGrid, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_FILTERS as categories } from "@/types/product";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";

export default function Browse() {
  const { products, isLoading, categoryCounts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [gridView, setGridView] = useState<2 | 3>(2);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const clearCategory = () => setSelectedCategory("All");
  const hasActiveFilters = selectedCategory !== "All";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold">Shop Thrifting</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Loading..." : `${products.length} unique finds waiting for you`}
          </p>
        </div>

        {/* Filter Bar - iPhone, MacBook, Watch only */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant={selectedCategory === cat.name ? "default" : "tag"}
              size="sm"
              onClick={() => setSelectedCategory(cat.name)}
              className="shrink-0"
            >
              {cat.name}
              <span className="ml-1 text-xs opacity-70">({categoryCounts[cat.name] ?? 0})</span>
            </Button>
          ))}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <Badge variant="secondary" className="gap-1">
              {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={clearCategory} />
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCategory}
              className="text-destructive hover:text-destructive"
            >
              Clear all
            </Button>
          </motion.div>
        )}

        <div className="flex gap-6">
          {/* Product Grid */}
          <div className="flex-1">
            {/* Grid Controls */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `Showing ${filteredProducts.length} results`}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={gridView === 2 ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => setGridView(2)}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={gridView === 3 ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => setGridView(3)}
                  className="hidden md:flex"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            <div
              className={cn(
                "grid gap-3 sm:gap-4 md:gap-6",
                gridView === 2
                  ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              )}
            >
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load more finds
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
