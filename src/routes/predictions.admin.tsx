import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy redirect — admin moved to /admin/predictions
export const Route = createFileRoute("/predictions/admin")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/predictions" });
  },
});
