import { createFileRoute } from "@tanstack/react-router";
import { predictions, getStats } from "@/data/predictions";

export const Route = createFileRoute("/api/predictions/json")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          JSON.stringify({ predictions, stats: getStats(predictions) }, null, 2),
          { headers: { "content-type": "application/json; charset=utf-8" } },
        ),
    },
  },
});
