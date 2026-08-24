import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { ShoppingBag, Store, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
  const { itemCount } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
            <Store className="size-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Atelier</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/store"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Shop
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartOpen}
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                {itemCount}
              </span>
            )}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-sm text-muted-foreground" disabled>
                  {user?.email || "Account"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
