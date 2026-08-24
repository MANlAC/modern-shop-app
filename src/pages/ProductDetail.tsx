import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { CartSheet } from "@/components/CartSheet";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Check, Minus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { formatNPR } from "@/lib/format";
import type { Product } from "@/types/store";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = useQuery(
    api.products.get,
    id ? { id: id as any } : "skip",
  ) as Product | null | undefined;
  const { addItem, items, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const cartItem = items.find((i) => i.product._id === id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    if (!isAuthenticated) {
      navigate("/auth?returnTo=/store");
      return;
    }
    if (!product) return;
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <div className="flex items-center justify-center py-32">
          <div className="animate-pulse text-sm text-muted-foreground">Loading product...</div>
        </div>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h2 className="text-lg font-bold">Product not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This item may have been removed or does not exist.
          </p>
          <Button className="mt-6" onClick={() => navigate("/store")}>
            Back to Store
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 gap-1 text-xs"
          onClick={() => navigate("/store")}
        >
          <ArrowLeft className="size-3.5" />
          Back to catalog
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-primary">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatNPR(product.price)}
              </span>
              {product.inStock ? (
                <Badge
                  variant="outline"
                  className="border-green-500/30 bg-green-500/10 text-green-400 text-[10px] font-semibold"
                >
                  In Stock
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-destructive/30 bg-destructive/10 text-destructive text-[10px] font-semibold"
                >
                  Sold Out
                </Badge>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Quantity + Add to Cart */}
            <div className="mt-auto pt-8">
              {quantity > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-8 text-center text-sm font-bold">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    className="flex-1 rounded-lg gap-2 font-semibold"
                    onClick={() => setCartOpen(true)}
                  >
                    <ShoppingBag className="size-4" />
                    View Cart
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="w-full rounded-lg gap-2 font-semibold"
                  onClick={handleAdd}
                  disabled={!product.inStock}
                >
                  {justAdded ? (
                    <>
                      <Check className="size-4" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
