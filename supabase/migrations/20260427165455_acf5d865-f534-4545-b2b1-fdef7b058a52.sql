-- Create speaking_engagements table
CREATE TABLE public.speaking_engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  organization TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Спикер',
  caption TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  event_date DATE,
  location TEXT,
  external_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.speaking_engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Speaking engagements are publicly readable"
  ON public.speaking_engagements FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert speaking engagements"
  ON public.speaking_engagements FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update speaking engagements"
  ON public.speaking_engagements FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete speaking engagements"
  ON public.speaking_engagements FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_updated_at_speaking
  BEFORE UPDATE ON public.speaking_engagements
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_speaking_visible_order ON public.speaking_engagements (is_visible, display_order, event_date DESC);

-- Storage bucket for speaking images
INSERT INTO storage.buckets (id, name, public)
VALUES ('speaking-images', 'speaking-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Speaking images publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'speaking-images');

CREATE POLICY "Admins can upload speaking images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'speaking-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update speaking images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'speaking-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete speaking images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'speaking-images' AND has_role(auth.uid(), 'admin'::app_role));