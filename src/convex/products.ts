import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/** List all products, optionally filtered by category */
export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return await ctx.db.query("products").collect();
  },
});

/** Get a single product by ID */
export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/** Get all distinct categories */
export const categories = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  },
});

/** Seed products (one-time use) */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return "already_seeded";

    const now = Date.now();
    const seedProducts = [
      {
        name: "Minimal Desk Lamp",
        description: "Adjustable LED lamp with a clean matte finish. Perfect for focused work.",
        price: 89.00,
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop",
        category: "Lighting",
        inStock: true,
        createdAt: now,
      },
      {
        name: "Ceramic Pour-Over Set",
        description: "Handcrafted ceramic dripper with thermal carafe. Makes 2 cups of clean, bright coffee.",
        price: 64.00,
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
        category: "Kitchen",
        inStock: true,
        createdAt: now,
      },
      {
        name: "Merino Wool Throw",
        description: "Lightweight merino wool throw in a natural herringbone weave. Incredibly soft.",
        price: 145.00,
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
        category: "Home",
        inStock: true,
        createdAt: now,
      },
      {
        name: "Brass Plant Misters",
        description: "Set of two solid brass misters with a vintage patina. Functional and decorative.",
        price: 42.00,
        imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop",
        category: "Home",
        inStock: true,
        createdAt: now,
      },
      {
        name: "Walnut Desk Organizer",
        description: "Solid walnut wood organizer with compartments for pens, cards, and small items.",
        price: 78.00,
        imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop",
        category: "Office",
        inStock: true,
        createdAt: now,
      },
      {
        name: "Linen Notebook",
        description: "A5 linen-bound notebook with 160 pages of cream 100gsm paper. Lay-flat binding.",
        price: 28.00,
        imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=600&fit=crop",
        category: "Office",
        inStock: true,
        createdAt: now,
      },
      {
        name: "Stone Incense Holder",
        description: "Carved natural stone incense holder with a minimalist tray design.",
        price: 35.00,
        imageUrl: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop",
        category: "Home",
        inStock: true,
        createdAt: now,
      },
      {
        name: "Stainless Steel Pour-Over Kettle",
        description: "Gooseneck kettle with precision spout. Ideal temperature control for brewing.",
        price: 56.00,
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop",
        category: "Kitchen",
        inStock: true,
        createdAt: now,
      },
    ];

    for (const product of seedProducts) {
      await ctx.db.insert("products", product);
    }
    return "seeded";
  },
});
