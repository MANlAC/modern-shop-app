import { useAuth } from "@/hooks/use-auth";
import { Loader2, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-5 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?returnTo=/admin" replace />;
  }

  if (user?.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <ShieldAlert className="mx-auto mb-3 size-8 text-destructive" />
          <p className="text-sm font-semibold">Admin access required</p>
          <p className="mt-1 text-xs text-muted-foreground">
            You don't have permission to view this page.
          </p>
        </div>
      </main>
    );
  }

  return children;
}
