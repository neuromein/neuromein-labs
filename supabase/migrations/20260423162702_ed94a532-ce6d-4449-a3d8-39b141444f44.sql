-- Enable realtime for predictions tables
ALTER TABLE public.predictions REPLICA IDENTITY FULL;
ALTER TABLE public.prediction_evidence REPLICA IDENTITY FULL;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='predictions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.predictions;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='prediction_evidence') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.prediction_evidence;
  END IF;
END $$;