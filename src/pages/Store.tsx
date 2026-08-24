import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Shop
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              Our Collection
            </h1>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Browse our curated selection of home goods, office essentials,
              and kitchenware.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-border/60 bg-card pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring/50 focus:ring-1 focus:ring-ring/30"
            />
          </div>

          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
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

        {/* Product Grid */}
        {products === undefined ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="mb-4 size-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-secondary">
              <Package className="size-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery || selectedCategory
                ? "Try adjusting your filters."
                : "Products will appear here soon."}
            </p>
          </div>
        )}
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
