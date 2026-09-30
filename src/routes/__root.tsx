import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ensureSession } from "@/lib/auth-guard";

const RootLayout = () => (
  <TooltipProvider>
    <div className="container mx-auto p-2 h-screen border border-x">
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster />
    </div>
  </TooltipProvider>
);

export const Route = createRootRoute({
  component: RootLayout,
  // Runs before every child route's own beforeLoad, so the session is settled
  // before any guard or loader decides what to render.
  beforeLoad: async () => {
    await ensureSession();
  },
});