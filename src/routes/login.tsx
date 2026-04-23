import { createFileRoute, redirect } from "@tanstack/react-router";

// Public login page removed — admin login is only available via the footer logo.
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
