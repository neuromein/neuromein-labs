import { createFileRoute } from "@tanstack/react-router";
import { fetchPredictions } from "@/data/predictions.fetch";
import { getStats } from "@/data/predictions";

export const Route = createFileRoute("/api/predictions/json")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const predictions = await fetchPredictions();
          const stats = getStats(predictions);
          return new Response(
            JSON.stringify({ predictions, stats }, null, 2),
            {
              headers: {
                "content-type": "application/json; charset=utf-8",
                "cache-control": "public, max-age=60",
              },
            },
          );
        } catch (err) {
          console.error("[api/predictions] fetch error:", err);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
