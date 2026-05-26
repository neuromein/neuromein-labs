DROP POLICY IF EXISTS "Predictions are publicly readable" ON public.predictions;
CREATE POLICY "Visible predictions are publicly readable" ON public.predictions FOR SELECT TO public USING (is_visible = true);
CREATE POLICY "Admins can read all predictions" ON public.predictions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Publications are publicly readable" ON public.publications;
CREATE POLICY "Visible publications are publicly readable" ON public.publications FOR SELECT TO public USING (is_visible = true);
CREATE POLICY "Admins can read all publications" ON public.publications FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Speaking engagements are publicly readable" ON public.speaking_engagements;
CREATE POLICY "Visible speaking engagements are publicly readable" ON public.speaking_engagements FOR SELECT TO public USING (is_visible = true);
CREATE POLICY "Admins can read all speaking engagements" ON public.speaking_engagements FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Evidence is publicly readable" ON public.prediction_evidence;
CREATE POLICY "Evidence for visible predictions is publicly readable" ON public.prediction_evidence FOR SELECT TO public USING (EXISTS (SELECT 1 FROM public.predictions p WHERE p.id = prediction_evidence.prediction_id AND p.is_visible = true));
CREATE POLICY "Admins can read all evidence" ON public.prediction_evidence FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));