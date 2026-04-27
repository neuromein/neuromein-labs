import { supabase } from "@/integrations/supabase/client";

export interface SpeakingEngagement {
  id: string;
  slug: string;
  organization: string;
  role: string;
  caption: string;
  description: string;
  imageUrl: string;
  eventDate: string | null;
  dateLabel: string | null;
  location: string | null;
  externalUrl: string | null;
  isVisible: boolean;
  displayOrder: number;
}

const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export function formatEventDate(iso: string | null): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS_RU[m - 1]} ${y}`;
}

interface DbRow {
  id: string;
  slug: string;
  organization: string;
  role: string;
  caption: string;
  description: string;
  image_url: string;
  event_date: string | null;
  location: string | null;
  external_url: string | null;
  is_visible: boolean;
  display_order: number;
}

function mapRow(r: DbRow): SpeakingEngagement {
  return {
    id: r.id,
    slug: r.slug,
    organization: r.organization,
    role: r.role,
    caption: r.caption,
    description: r.description,
    imageUrl: r.image_url,
    eventDate: r.event_date,
    dateLabel: formatEventDate(r.event_date),
    location: r.location,
    externalUrl: r.external_url,
    isVisible: r.is_visible,
    displayOrder: r.display_order,
  };
}

export async function fetchSpeaking(opts?: {
  includeHidden?: boolean;
}): Promise<SpeakingEngagement[]> {
  let query = supabase
    .from("speaking_engagements")
    .select("*")
    .order("display_order", { ascending: true })
    .order("event_date", { ascending: false });

  if (!opts?.includeHidden) query = query.eq("is_visible", true);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as unknown as DbRow));
}

export async function fetchSpeakingBySlug(
  slug: string,
): Promise<SpeakingEngagement | null> {
  const { data, error } = await supabase
    .from("speaking_engagements")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapRow(data as unknown as DbRow);
}