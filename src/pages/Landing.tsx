import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Package, Shield, Truck } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Product } from "@/types/store";
import { Navbar } from "@/components/Navbar";
import { CartSheet } from "@/components/CartSheet";
import { useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function Landing() {
  const navigate = useNavigate();
  const products = useQuery(api.products.list, {}) as Product[] | undefined;
  const featured = products?.slice(0, 3) ?? [];
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-background to-secondary/60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[80vh] flex-col items-center justify-center py-24 text-center">
            <motion.div {...fadeUp}>
              <span className="mb-6 inline-block rounded-full border border-border/60 bg-card/80 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur-sm">
                Curated objects for everyday living
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Thoughtfully designed,
              <br />
              <span className="text-muted-foreground">beautifully made.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              Discover a curated collection of home goods, office essentials,
              and kitchenware — crafted for those who appreciate quality over
              quantity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                size="lg"
                className="rounded-full px-8 text-base"
                onClick={() => navigate("/store")}
              >
                Browse Collection
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base"
                onClick={() => navigate("/auth")}
              >
                Create Account
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 py-16 sm:grid-cols-3 sm:gap-12">
            {[
              {
                icon: Package,
                title: "Curated Selection",
                desc: "Every item in our collection is chosen for its quality, design, and lasting value.",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "Free shipping on all orders. Most items ship within 2–3 business days.",
              },
              {
                icon: Shield,
                title: "Satisfaction Guaranteed",
                desc: "Not in love? Return within 30 days for a full refund. No questions asked.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
                  <f.icon className="size-5" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Featured
                </p>
                <h2 className="text-3xl font-bold tracking-tight">
                  Most Popular
                </h2>
              </div>
              <Button
                variant="ghost"
                className="hidden gap-1 sm:flex"
                onClick={() => navigate("/store")}
              >
                View all
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {product.category}
                    </p>
                    <h3 className="text-base font-semibold">{product.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => navigate("/store")}
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex justify-center sm:hidden">
              <Button
                variant="outline"
                className="gap-1 rounded-full"
                onClick={() => navigate("/store")}
              >
                View all products
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center py-20 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Ready to elevate your space?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 max-w-md text-muted-foreground"
            >
              Explore our full collection and find pieces that speak to you.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Button
                size="lg"
                className="rounded-full px-8 text-base"
                onClick={() => navigate("/store")}
              >
                Shop Now
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background">
                <Package className="size-3.5" />
              </div>
              <span className="text-sm font-semibold">Atelier</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 Atelier. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
