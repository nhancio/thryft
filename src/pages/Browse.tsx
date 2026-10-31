import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Grid3X3, LayoutGrid, X, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CATEGORY_FILTERS as categories } from "@/types/product";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";

const VALID_CATEGORIES = ["All", "iPhone", "iPad", "MacBook", "Mac Mini", "iMac", "Watch", "AirPods", "iPad Pencil", "Apple Hub", "Apple TV"];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "All";
  const searchQueryFromUrl = searchParams.get("q") ?? "";
  const { products, isLoading, categoryCounts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(
    VALID_CATEGORIES.includes(categoryFromUrl) ? categoryFromUrl : "All"
  );
  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl);
  const [gridView, setGridView] = useState<2 | 3>(2);

  // Sync from URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && VALID_CATEGORIES.includes(cat)) setSelectedCategory(cat);
    const q = searchParams.get("q") ?? "";
    setSearchQuery(q);
  }, [searchParams]);

  /** Search products by matching query against title, brand, category, tags, description. */
  const filteredProducts = useMemo(() => {
    let result = products;

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const terms = q.split(/\s+/);
      result = result.filter((product) => {
        const haystack = [
          product.title,
          product.brand,
          product.category,
          product.subcategory,
          product.description,
          ...(product.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return terms.every((term) => haystack.includes(term));
      });
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  const setCategory = (cat: string) => {
    setSelectedCategory(cat);
    const next = new URLSearchParams(searchParams);
    if (cat === "All") {
      next.delete("category");
    } else {
      next.set("category", cat);
    }
    setSearchParams(next, { replace: true });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    const q = searchQuery.trim();
    if (q) {
      next.set("q", q);
    } else {
      next.delete("q");
    }
    setSearchParams(next, { replace: true });
  };

  const clearSearch = () => {
    setSearchQuery("");
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const clearCategory = () => setCategory("All");
  const hasActiveFilters = selectedCategory !== "All" || searchQuery.trim().length > 0;

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-4 sm:py-6 px-3 sm:px-4">
        {/* Page Header */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold">Shop Thrifting</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isLoading ? "Loading..." : `${products.length} unique finds waiting for you`}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand, category..."
            className="pl-10 pr-10 rounded-full h-11 bg-muted/30 border-border focus:bg-background"
          />
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant={selectedCategory === cat.name ? "default" : "tag"}
              size="sm"
              onClick={() => setCategory(cat.name)}
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
            className="flex flex-wrap gap-2 mb-4"
          >
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={clearCategory} />
              </Badge>
            )}
            {searchQuery.trim() && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery.trim()}
                <X className="w-3 h-3 cursor-pointer" onClick={clearSearch} />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
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
            <div className="flex items-center justify-between mb-3">
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
                "grid gap-2 sm:gap-3 md:gap-4",
                gridView === 2
                  ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              )}
            >
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {/* No results */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Try a different search term or clear your filters.
                </p>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </div>
            )}

            {/* End of results */}
            {filteredProducts.length > 0 && (
              <p className="text-center mt-8 text-sm text-muted-foreground">
                You've seen all {filteredProducts.length} items
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
