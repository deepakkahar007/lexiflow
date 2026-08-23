import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TanstackRouter } from "./integrations/tanstack-router/TanstackRouter";
import { TanstackQuery } from "./integrations/tanstack-query/TanstackQuery";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <TanstackQuery>
      <TanstackRouter />
    </TanstackQuery>
  </StrictMode>,
);
