import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { CartSheet } from "@/components/CartSheet";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { Product, Order } from "@/types/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function formatNPR(n: number) {
  return `Rs.${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const products = useQuery(api.products.list, {}) as Product[] | undefined;
  const orders = useQuery(api.orders.allOrders) as Order[] | undefined;
  const createProduct = useMutation(api.admin.createProduct);
  const updateProduct = useMutation(api.admin.updateProduct);
  const deleteProduct = useMutation(api.admin.deleteProduct);
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const changeAdminPassword = useMutation(api.admin.changeAdminPassword);

  const [cartOpen, setCartOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formInStock, setFormInStock] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormImageUrl("");
    setFormCategory("");
    setFormInStock(true);
  };

  const openEdit = (p: Product) => {
    resetForm();
    setEditingProduct(p);
    setFormName(p.name);
    setFormDescription(p.description);
    setFormPrice(String(p.price));
    setFormImageUrl(p.imageUrl);
    setFormCategory(p.category);
    setFormInStock(p.inStock);
  };

  const handleSave = async () => {
    if (!formName || !formPrice || !formCategory) {
      toast.error("Name, price, and category are required.");
      return;
    }
    setIsSaving(true);
    try {
      const data = {
        name: formName,
        description: formDescription,
        price: parseFloat(formPrice),
        imageUrl: formImageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
        category: formCategory,
        inStock: formInStock,
      };

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id as any, ...data });
        toast.success("Product updated.");
      } else {
        await createProduct(data);
        toast.success("Product created.");
      }
      resetForm();
      setEditingProduct(null);
      setShowNewProduct(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsSaving(true);
    try {
      await deleteProduct({ id: deletingId as any });
      toast.success("Product removed.");
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    status: Order["status"],
  ) => {
    try {
      await updateOrderStatus({ id: orderId as any, status });
      toast.success(`Order marked as ${status}.`);
    } catch {
      toast.error("Failed to update order status.");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <AlertCircle className="mb-4 size-8 text-destructive" />
          <h2 className="text-lg font-bold">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You need admin privileges to access this page.
          </p>
          <Button className="mt-6" onClick={() => navigate("/store")}>
            Back to Store
          </Button>
        </div>
      </div>
    );
  }

  const statusLabel: Record<string, { label: string; icon: any }> = {
    pending: { label: "Pending", icon: Clock },
    confirmed: { label: "Confirmed", icon: CheckCircle },
    shipped: { label: "Shipped", icon: Truck },
    delivered: { label: "Delivered", icon: Package },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 gap-1 text-xs"
          onClick={() => navigate("/store")}
        >
          <ArrowLeft className="size-3.5" />
          Back to Store
        </Button>

        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
              Admin
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Products", value: products?.length ?? 0, icon: Package },
            { label: "Total Orders", value: orders?.length ?? 0, icon: ShoppingCart },
            { label: "Pending", value: orders?.filter((o) => o.status === "pending").length ?? 0, icon: Clock },
            {
              label: "Revenue",
              value: formatNPR(orders?.reduce((s, o) => s + o.total, 0) ?? 0),
              icon: CheckCircle,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border/40 bg-card p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="size-3.5 text-primary" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Products Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold">Products</h2>
            <Button
              size="sm"
              className="rounded-lg gap-1.5 text-xs font-semibold"
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setShowNewProduct(true);
              }}
            >
              <Plus className="size-3.5" />
              Add Product
            </Button>
          </div>

          {products === undefined ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-border/40 bg-card/50 py-12 text-center">
              <Package className="mx-auto mb-3 size-6 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No products yet. Add your first product to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-4 rounded-lg border border-border/40 bg-card p-3 transition-colors hover:border-border"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="size-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">{p.name}</h3>
                      {!p.inStock && (
                        <Badge variant="outline" className="text-[9px] border-destructive/30 text-destructive">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {p.category} · {formatNPR(p.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => openEdit(p)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => setDeletingId(p._id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="mt-10">
          <h2 className="text-base font-bold mb-4">Recent Orders</h2>

          {orders === undefined ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-xl border border-border/40 bg-card/50 py-12 text-center">
              <ShoppingCart className="mx-auto mb-3 size-6 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No orders have been placed yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 20).map((order) => {
                const sl = statusLabel[order.status];
                const SI = sl.icon;
                return (
                  <div
                    key={order._id}
                    className="rounded-lg border border-border/40 bg-card p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <Badge variant="outline" className="gap-1 text-[10px]">
                            <SI className="size-2.5" />
                            {sl.label}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">
                          {formatNPR(order.total)}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value as Order["status"],
                            )
                          }
                          className="h-8 rounded-lg border border-border/50 bg-card px-2 text-xs font-medium text-foreground outline-none focus:border-primary/40"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3 border-t border-border/30 pt-3 space-y-1">
                      {order.items.map((item, j) => (
                        <div
                          key={j}
                          className="flex justify-between text-xs text-muted-foreground"
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatNPR(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Product Form Dialog — form JSX is inlined to avoid remount on each keystroke */}
      <Dialog
        open={showNewProduct || editingProduct !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowNewProduct(false);
            setEditingProduct(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold">Name</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Product name"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Category</Label>
                <Input
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Kitchen"
                  className="mt-1 h-9 text-sm"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Description</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Product description"
                className="mt-1 text-sm"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold">Price (Rs.)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="0.00"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Image URL</Label>
                <Input
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 h-9 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formInStock}
                onChange={(e) => setFormInStock(e.target.checked)}
                className="accent-primary"
              />
              <Label className="text-xs font-semibold">In Stock</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowNewProduct(false);
                setEditingProduct(null);
                resetForm();
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-1.5"
            >
              {isSaving && <Loader2 className="size-3 animate-spin" />}
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The product will be permanently
            removed from the catalog.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingId(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isSaving}
              className="gap-1.5"
            >
              {isSaving && <Loader2 className="size-3 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
