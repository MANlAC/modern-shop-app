import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { Product } from "@/types/store";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = items.some((i) => i.product._id === product._id);

  const handleAdd = () => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-border"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-base font-semibold leading-tight">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between pt-4">
          <span className="text-lg font-bold tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            className="rounded-full px-4"
            onClick={handleAdd}
          >
            {justAdded ? (
              <>
                <Check className="mr-1 size-3.5" />
                Added
              </>
            ) : (
              <>
                <Plus className="mr-1 size-3.5" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
