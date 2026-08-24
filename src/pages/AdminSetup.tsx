import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Shield, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AdminSetup() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isConfigured = useQuery(api.admin.isConfigured);
  const setupAdmin = useMutation(api.admin.setupAdmin);
  const verifyAndElevate = useMutation(api.admin.verifyAndElevate);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSetup = async () => {
    if (!isAuthenticated) {
      toast.error("You must be signed in first.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsProcessing(true);
    try {
      await setupAdmin({ password });
      await verifyAndElevate({ password });
      setIsDone(true);
      toast.success("Admin access configured successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to set up admin access.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-sm border-border/40 bg-card text-center">
          <CardContent className="pt-8">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-6 text-primary" />
            </div>
            <h2 className="text-lg font-bold">Admin Access Configured</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You can now manage products and orders from the admin panel.
            </p>
            <Button
              className="mt-6 gap-2"
              onClick={() => navigate("/admin")}
            >
              Open Admin Panel
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isConfigured) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-sm border-border/40 bg-card text-center">
          <CardContent className="pt-8">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="size-6 text-primary" />
            </div>
            <h2 className="text-lg font-bold">Admin Already Set Up</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Admin access has already been configured for this store. Sign
              in as the admin user and use the admin panel.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => navigate("/store")}
            >
              Back to Store
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-sm border-border/40 bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="size-6 text-primary" />
          </div>
          <CardTitle className="text-lg">Set Up Admin Access</CardTitle>
          <CardDescription>
            Choose a password to secure the admin panel. This can only be
            done once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated && (
            <p className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
              Please sign in first, then return to this page to set up admin
              access.
            </p>
          )}
          <div>
            <Label className="text-xs font-semibold">Admin Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a secure password"
              className="mt-1 h-9 text-sm"
              disabled={!isAuthenticated}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold">Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="mt-1 h-9 text-sm"
              disabled={!isAuthenticated}
            />
          </div>
          <Button
            className="w-full gap-1.5"
            onClick={handleSetup}
            disabled={isProcessing || !isAuthenticated}
          >
            {isProcessing && <Loader2 className="size-3.5 animate-spin" />}
            Configure Admin Access
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
