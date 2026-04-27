ALTER TABLE public.predictions
ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS predictions_is_visible_idx
ON public.predictions (is_visible);