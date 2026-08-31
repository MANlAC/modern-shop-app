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
import { CheckCircle2, Loader2, User, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      onOpenChange(false);
      toast.info("Sign in to place your order");
      navigate("/auth?returnTo=/store");
      return;
    }

    if (!contactName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!contactPhone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!contactAddress.trim()) {
      toast.error("Please enter your delivery address.");
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
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactAddress: contactAddress.trim(),
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
      setContactName("");
      setContactPhone("");
      setContactAddress("");
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
            Please confirm your items and delivery details before placing your order.
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

        <div className="border-t border-border/60 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Delivery Details
          </p>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <User className="size-3" />
                Full Name
              </Label>
              <Input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your full name"
                className="mt-1 h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Phone className="size-3" />
                Phone Number
              </Label>
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +977 9800000000"
                className="mt-1 h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <MapPin className="size-3" />
                Delivery Address
              </Label>
              <Textarea
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                placeholder="Full delivery address"
                className="mt-1 text-sm"
                rows={2}
              />
            </div>
          </div>
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
