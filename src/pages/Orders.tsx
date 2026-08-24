import { Navbar } from "@/components/Navbar";
import { CartSheet } from "@/components/CartSheet";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useState } from "react";
import type { Order } from "@/types/store";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  confirmed: { label: "Confirmed", icon: CheckCircle, variant: "default" as const },
  shipped: { label: "Shipped", icon: Truck, variant: "default" as const },
  delivered: { label: "Delivered", icon: Package, variant: "default" as const },
};

export default function Orders() {
  const orders = useQuery(api.orders.myOrders) as Order[] | undefined;
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 gap-1 text-xs"
            onClick={() => navigate("/store")}
          >
            <ArrowLeft className="size-3.5" />
            Back to Store
          </Button>

          <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your recent purchases and delivery status.
          </p>
        </motion.div>

        <div className="mt-6 space-y-3">
          {orders === undefined ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-sm text-muted-foreground">
                Loading orders...
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-border/40 bg-card py-16">
              <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground/50">
                <Package className="size-5" />
              </div>
              <h3 className="text-base font-bold">No orders yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your orders will appear here after you make a purchase.
              </p>
              <Button
                className="mt-5 gap-1.5 text-xs font-semibold"
                onClick={() => navigate("/store")}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            orders.map((order, i) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rounded-xl border border-border/40 bg-card p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold">
                          #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <Badge variant={status.variant} className="gap-1 text-[10px]">
                          <StatusIcon className="size-2.5" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="text-base font-bold text-foreground">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 border-t border-border/30 pt-3">
                    {order.items.map((item, j) => (
                      <div
                        key={j}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
