// Fetches publications from Supabase. Single source of truth for /blog,
// the home-page slider and the admin CMS.
import { supabase } from "@/integrations/supabase/client";

export interface Publication {
  id: string;
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  body: string;
  /** ISO date, e.g. "2025-11-20" */
  publishedAt: string;
  /** Localised label, e.g. "20 ноября 2025" */
  dateLabel: string;
  telegramUrl: string | null;
  isVisible: boolean;
  displayOrder: number;
}

const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export function formatPublicationDate(iso: string): string {
  // iso is "YYYY-MM-DD"; build label without timezone surprises
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS_RU[m - 1]} ${y}`;
}

interface DbPublication {
  id: string;
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  body: string;
  published_at: string;
  telegram_url: string | null;
  is_visible: boolean;
  display_order: number;
}

function mapRow(r: DbPublication): Publication {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    tag: r.tag,
    excerpt: r.excerpt,
    body: r.body,
    publishedAt: r.published_at,
    dateLabel: formatPublicationDate(r.published_at),
    telegramUrl: r.telegram_url,
    isVisible: r.is_visible,
    displayOrder: r.display_order,
  };
}

export async function fetchPublications(opts?: {
  includeHidden?: boolean;
}): Promise<Publication[]> {
  let query = supabase
    .from("publications")
    .select("*")
    .order("published_at", { ascending: false })
    .order("display_order", { ascending: true });

  if (!opts?.includeHidden) query = query.eq("is_visible", true);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as unknown as DbPublication));
}

export async function fetchPublicationBySlug(
  slug: string,
): Promise<Publication | null> {
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapRow(data as unknown as DbPublication);
}