import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { Product } from "@/types/store";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/auth?returnTo=/store");
      return;
    }
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_oklch(0.78_0.18_210_/_0.06)]"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/40">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary/80">
          {product.category}
        </p>
        <h3 className="text-sm font-bold leading-snug text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <span className="text-base font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            className="h-8 rounded-lg px-3 text-xs font-semibold"
            onClick={handleAdd}
            disabled={!product.inStock}
          >
            {justAdded ? (
              <>
                <Check className="mr-1 size-3" />
                Added
              </>
            ) : (
              <>
                <Plus className="mr-1 size-3" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
