import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

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

export const Route = createRootRoute({ component: RootLayout });
