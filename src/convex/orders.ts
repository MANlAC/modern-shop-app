import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/** Place a new order */
export const place = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be signed in to place an order");

    if (args.items.length === 0) throw new Error("Order must have at least one item");

    const total = args.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const orderId = await ctx.db.insert("orders", {
      userId,
      items: args.items,
      total,
      status: "pending",
      createdAt: Date.now(),
    });

    return orderId;
  },
});

/** Get orders for the current user */
export const myOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

/** Get a single order by ID (must own it) */
export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const order = await ctx.db.get(args.id);
    if (!order) return null;
    if (order.userId !== userId) return null;
    return order;
  },
});

/** Get all orders (admin only) */
export const allOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") return [];

    return await ctx.db.query("orders").order("desc").collect();
  },
});

/** Update order status (admin only) */
export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be signed in");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin access required");

    await ctx.db.patch(args.id, { status: args.status });
    return "ok";
  },
});
