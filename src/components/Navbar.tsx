import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ShoppingBag,
  User,
  LogOut,
  ShieldCheck,
  Shield,
  LayoutGrid,
  ClipboardList,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
  const { itemCount } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  return (
    <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
            M
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            MANIAC SHOP
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            to="/store"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <LayoutGrid className="size-3.5" />
            Store
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              <ClipboardList className="size-3.5" />
              Orders
            </Link>
          )}

          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartOpen}
            >
              <ShoppingBag className="size-4" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isAdmin ? (
                    <ShieldCheck className="size-4 text-primary" />
                  ) : (
                    <User className="size-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium truncate">{user?.email || "Account"}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-primary">
                      <Shield className="size-2.5" /> Admin
                    </span>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  <ClipboardList className="mr-2 size-3.5" />
                  My Orders
                </DropdownMenuItem>

                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <ShieldCheck className="mr-2 size-3.5 text-primary" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                {!isAdmin && isAuthenticated && (
                  <DropdownMenuItem onClick={() => navigate("/admin/setup")}>
                    <Shield className="mr-2 size-3.5" />
                    Set Up Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                >
                  <LogOut className="mr-2 size-3.5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (          <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </Button>
          )}

          <div className="ml-1 border-l border-border/40 pl-2.5">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
