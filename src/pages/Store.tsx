import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { CartSheet } from "@/components/CartSheet";
import { ProductCard } from "@/components/ProductCard";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Package, Loader2 } from "lucide-react";
import type { Product } from "@/types/store";

export default function Store() {
  const products = useQuery(api.products.list, {}) as Product[] | undefined;
  const categories = useQuery(api.products.categories) as string[] | undefined;
  const seedProducts = useMutation(api.products.seed);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  // Auto-seed if store is empty
  useEffect(() => {
    if (products !== undefined && products.length === 0) {
      seedProducts();
    }
  }, [products, seedProducts]);

  const filteredProducts = products?.filter((p) => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      {/* Header */}
      <div className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
              Catalog
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              All Products
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Browse, search, and filter through the full product catalog.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-border/50 bg-card pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-lg px-3 text-xs font-semibold"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  className="h-8 rounded-lg px-3 text-xs font-semibold"
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat ? null : cat)
                  }
                >
                  {cat}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Product count */}
        {filteredProducts && (
          <p className="mb-4 text-xs text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Product Grid */}
        {products === undefined ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="mb-4 size-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading catalog...</p>
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-card/50 py-20">
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
              <Package className="size-5" />
            </div>
            <h3 className="text-base font-bold">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery || selectedCategory
                ? "Try adjusting your search or filters."
                : "The catalog is empty. Check back soon."}
            </p>
          </div>
        )}
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
