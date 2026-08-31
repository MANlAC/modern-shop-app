import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { sha256 } from "@oslojs/crypto/sha2";

function hashPassword(password: string): string {
  const bytes = new TextEncoder().encode(password);
  const hash = sha256(bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Bootstrap the admin password (only works if no adminConfig exists yet) */
export const setupAdmin = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("adminConfig").first();
    if (existing) throw new Error("Admin password already configured");

    await ctx.db.insert("adminConfig", {
      adminPasswordHash: hashPassword(args.password),
    });
    return "ok";
  },
});

/** Verify admin password and elevate the current user to admin role */
export const verifyAndElevate = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You must be signed in");

    const config = await ctx.db.query("adminConfig").first();
    if (!config) throw new Error("Admin access has not been configured yet");

    const hash = hashPassword(args.password);
    if (hash !== config.adminPasswordHash) {
      throw new Error("Incorrect admin password");
    }

    await ctx.db.patch(userId, { role: "admin" });
    return "ok";
  },
});

/** Check if admin config exists (for setup flow) */
export const isConfigured = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("adminConfig").first();
    return config !== null;
  },
});

/** Change admin password (requires current password) */
export const changeAdminPassword = mutation({
  args: { currentPassword: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You must be signed in");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const config = await ctx.db.query("adminConfig").first();
    if (!config) throw new Error("Admin access has not been configured yet");

    const currentHash = hashPassword(args.currentPassword);
    if (currentHash !== config.adminPasswordHash) {
      throw new Error("Current password is incorrect");
    }

    if (args.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters");
    }

    await ctx.db.patch(config._id, {
      adminPasswordHash: hashPassword(args.newPassword),
    });
    return "ok";
  },
});

/** Allow any authenticated user to elevate themselves if they know the admin password */
export const elevateWithPassword = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You must be signed in");

    const config = await ctx.db.query("adminConfig").first();
    if (!config) throw new Error("Admin access has not been configured yet");

    const hash = hashPassword(args.password);
    if (hash !== config.adminPasswordHash) {
      throw new Error("Incorrect admin password");
    }

    await ctx.db.patch(userId, { role: "admin" });
    return "ok";
  },
});

/** ───────── Product management (admin only) ───────── */

function assertAdmin(ctx: any) {
  const userId = getAuthUserId(ctx as any);
  return userId;
}

export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageUrl: v.string(),
    category: v.string(),
    inStock: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be signed in");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const id = await ctx.db.insert("products", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageUrl: v.string(),
    category: v.string(),
    inStock: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be signed in");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return "ok";
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be signed in");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.delete(args.id);
    return "ok";
  },
});
