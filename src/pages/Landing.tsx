import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Truck, Terminal, Code2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatNPR } from "@/lib/format";
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.78 0.18 210) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.18 210) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[85vh] flex-col items-center justify-center py-24 text-center">
            <motion.div {...fadeUp}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary">
                <Terminal className="size-3" />
                Built for performance
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
            >
              The platform for
              <br />
              <span className="text-gradient-primary">
                modern commerce.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              A clean, fast storefront where customers browse products and
              place orders. No clutter, no bloat — just what works.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                size="lg"
                className="gap-2 rounded-lg px-8 text-sm font-semibold glow-primary"
                onClick={() => navigate("/store")}
              >
                Browse Products
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-lg px-8 text-sm font-semibold"
                onClick={() => navigate("/auth")}
              >
                <Code2 className="mr-2 size-4" />
                Sign In
              </Button>
            </motion.div>

            {/* Terminal-style code snippet */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-16 w-full max-w-lg overflow-hidden rounded-xl border border-border/50 bg-card/80 text-left backdrop-blur"
            >
              <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2.5">
                <div className="size-2.5 rounded-full bg-destructive/60" />
                <div className="size-2.5 rounded-full bg-primary/40" />
                <div className="size-2.5 rounded-full bg-green-500/40" />
                <span className="ml-2 text-[10px] font-medium text-muted-foreground">
                  modern-shop ~/store
                </span>
              </div>
              <div className="px-4 py-3 font-mono text-xs leading-5 text-muted-foreground">
                <span className="text-primary">$</span>{" "}
                <span className="text-foreground">bun run shop</span>
                <span className="ml-2 text-muted-foreground/50">
                  # Launch your storefront
                </span>
                <br />
                <span className="text-green-400">✓</span>{" "}
                <span className="text-foreground">200 products loaded</span>
                <br />
                <span className="text-green-400">✓</span>{" "}
                <span className="text-foreground">cart ready</span>
                <br />
                <span className="text-green-400">✓</span>{" "}
                <span className="text-foreground">server running on port 3000</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 py-20 sm:grid-cols-3 sm:gap-8">
            {[
              {
                icon: Zap,
                title: "Fast by Default",
                desc: "Built on Convex with real-time reactivity. Products, cart, and orders sync instantly across sessions.",
              },
              {
                icon: Shield,
                title: "Secure Admin",
                desc: "Password-protected admin panel. Add, edit, and remove products without touching the codebase.",
              },
              {
                icon: Truck,
                title: "Order Pipeline",
                desc: "Customers browse, add to cart, and check out in seconds. Orders flow through a clean status pipeline.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-xl border border-border/40 bg-card/50 p-6 transition-colors hover:border-primary/20"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="text-sm font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="border-t border-border/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                  Featured
                </p>
                <h2 className="text-2xl font-bold tracking-tight">
                  Top Picks
                </h2>
              </div>
              <Button
                variant="ghost"
                className="hidden gap-1 text-sm sm:flex"
                onClick={() => navigate("/store")}
              >
                View all
                <ArrowRight className="size-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/30"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary/80">
                      {product.category}
                    </p>
                    <h3 className="text-sm font-bold">{product.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-base font-bold">
                        {formatNPR(product.price)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-lg px-3 text-xs font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/store");
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex justify-center sm:hidden">
              <Button
                variant="outline"
                className="gap-1 rounded-lg text-sm"
                onClick={() => navigate("/store")}
              >
                View all products
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center py-20 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Ready to get started?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 max-w-sm text-sm text-muted-foreground"
            >
              Browse the full catalog, build your cart, and place your first
              order in under a minute.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex gap-3"
            >
              <Button
                size="lg"
                className="gap-2 rounded-lg px-8 text-sm font-semibold"
                onClick={() => navigate("/store")}
              >
                Open Store
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                M
              </div>
              <span className="text-xs font-bold">Modern Shop</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              © 2026 Modern Shop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
