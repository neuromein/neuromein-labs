import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/predictions/json")({
  server: {
    handlers: {
      GET: () => new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } }),
    },
  },
});
