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

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 gap-1"
            onClick={() => navigate("/store")}
          >
            <ArrowLeft className="size-4" />
            Back to Store
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="mt-2 text-muted-foreground">
            Track your recent orders and their status.
          </p>
        </motion.div>

        <div className="mt-8 space-y-4">
          {orders === undefined ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-sm text-muted-foreground">
                Loading orders...
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card py-16">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-secondary">
                <Package className="size-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No orders yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                When you place an order, it will appear here.
              </p>
              <Button
                className="mt-6"
                onClick={() => navigate("/store")}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            orders.map((order, i) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <Badge variant={status.variant}>
                          <StatusIcon className="mr-1 size-3" />
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
                    <span className="text-lg font-bold">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
                    {order.items.map((item, j) => (
                      <div
                        key={j}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
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
