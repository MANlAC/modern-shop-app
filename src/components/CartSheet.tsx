import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { formatNPR } from "@/lib/format";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { CheckoutDialog } from "./CheckoutDialog";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader className="border-b border-border/60 pb-4">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="size-5" />
              Cart
              {itemCount > 0 && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {itemCount}
                </span>
              )}
            </SheetTitle>
            <SheetDescription>
              {itemCount === 0
                ? "Your cart is empty"
                : `${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="mb-4 size-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Add items from the store to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-4 rounded-xl border border-border/60 bg-card p-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="size-16 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-medium leading-tight">
                          {item.product.name}
                        </h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatNPR(item.product.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product._id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border/60 pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatNPR(total)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  onOpenChange(false);
                  setCheckoutOpen(true);
                }}
              >
                Checkout — {formatNPR(total)}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onOrderComplete={() => {
          setCheckoutOpen(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
