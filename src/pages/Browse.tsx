import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts, categories, sizes, conditions, eras, priceRanges } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Browse() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState<2 | 3>(2);

  const toggleFilter = (
    value: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedSizes([]);
    setSelectedConditions([]);
    setSelectedEras([]);
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedSizes.length > 0 ||
    selectedConditions.length > 0 ||
    selectedEras.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold">Shop Thrifting</h1>
          <p className="text-muted-foreground mt-1">
            {mockProducts.length} unique finds waiting for you
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {selectedSizes.length +
                  selectedConditions.length +
                  selectedEras.length +
                  (selectedCategory !== "All" ? 1 : 0)}
              </Badge>
            )}
          </Button>

          {/* Category Pills */}
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant={selectedCategory === cat.name ? "default" : "tag"}
              size="sm"
              onClick={() => setSelectedCategory(cat.name)}
              className="shrink-0"
            >
              {cat.name}
              <span className="ml-1 text-xs opacity-70">({cat.count})</span>
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
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSelectedCategory("All")}
                />
              </Badge>
            )}
            {selectedSizes.map((size) => (
              <Badge key={size} variant="secondary" className="gap-1">
                Size: {size}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                />
              </Badge>
            ))}
            {selectedConditions.map((cond) => (
              <Badge key={cond} variant="secondary" className="gap-1">
                {cond}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => toggleFilter(cond, selectedConditions, setSelectedConditions)}
                />
              </Badge>
            ))}
            {selectedEras.map((era) => (
              <Badge key={era} variant="secondary" className="gap-1">
                {era}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => toggleFilter(era, selectedEras, setSelectedEras)}
                />
              </Badge>
            ))}
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
          {/* Sidebar Filters */}
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 256 }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden md:block w-64 shrink-0"
            >
              <div className="sticky top-24 space-y-6">
                {/* Sizes */}
                <div>
                  <h3 className="font-semibold mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes.includes(size) ? "default" : "tag"}
                        size="sm"
                        onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <h3 className="font-semibold mb-3">Condition</h3>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map((cond) => (
                      <Button
                        key={cond}
                        variant={selectedConditions.includes(cond) ? "default" : "tag"}
                        size="sm"
                        onClick={() =>
                          toggleFilter(cond, selectedConditions, setSelectedConditions)
                        }
                      >
                        {cond}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Era */}
                <div>
                  <h3 className="font-semibold mb-3">Era</h3>
                  <div className="flex flex-wrap gap-2">
                    {eras.map((era) => (
                      <Button
                        key={era}
                        variant={selectedEras.includes(era) ? "default" : "tag"}
                        size="sm"
                        onClick={() => toggleFilter(era, selectedEras, setSelectedEras)}
                      >
                        {era}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Ranges */}
                <div>
                  <h3 className="font-semibold mb-3">Price</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label
                        key={range.label}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {/* Grid Controls */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {mockProducts.length} results
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
                "grid gap-4 md:gap-6",
                gridView === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3"
              )}
            >
              {mockProducts.map((product, i) => (
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
