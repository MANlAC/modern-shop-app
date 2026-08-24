import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatNPR } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderComplete: () => void;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  onOrderComplete,
}: CheckoutDialogProps) {
  const { items, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const placeOrder = useMutation(api.orders.place);
  const navigate = useNavigate();
  const [isPlacing, setIsPlacing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      onOpenChange(false);
      toast.info("Sign in to place your order");
      navigate("/auth?returnTo=/store");
      return;
    }

    setIsPlacing(true);
    try {
      await placeOrder({
        items: items.map((i) => ({
          productId: i.product._id as any,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
      });
      clearCart();
      setIsComplete(true);
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  const handleClose = () => {
    if (isComplete) {
      setIsComplete(false);
      onOrderComplete();
      navigate("/orders");
    } else {
      onOpenChange(false);
    }
  };

  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-accent">
              <CheckCircle2 className="size-8 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Order Confirmed</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for your purchase! We'll start preparing your order
              right away.
            </p>
            <Button className="mt-6" onClick={handleClose}>
              View My Orders
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Your Order</DialogTitle>
          <DialogDescription>
            Please confirm the items below before placing your order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="size-10 rounded-md object-cover"
                />
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-medium">
                {formatNPR(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border/60 pt-3">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatNPR(total)}</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPlacing}
          >
            Cancel
          </Button>
          <Button onClick={handlePlaceOrder} disabled={isPlacing || items.length === 0}>
            {isPlacing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Placing...
              </>
            ) : (
              `Place Order — ${formatNPR(total)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
