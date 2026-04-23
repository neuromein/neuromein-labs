
-- 1. Роли пользователей (отдельная таблица — защита от privilege escalation)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER функция для проверки роли (избегает рекурсии RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Пользователи могут видеть свои роли
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Только админы могут управлять ролями
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Прогнозы
CREATE TYPE public.prediction_status AS ENUM (
  'fulfilled', 'partial', 'not_fulfilled', 'in_progress', 'too_early'
);

CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  statement TEXT NOT NULL,
  source_work TEXT NOT NULL,
  source_work_title TEXT NOT NULL,
  source_section TEXT,
  source_page INT,
  date_made DATE NOT NULL,
  target_horizon TEXT NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  status prediction_status NOT NULL DEFAULT 'in_progress',
  status_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  confidence INT CHECK (confidence BETWEEN 0 AND 100),
  notes TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Все могут читать прогнозы (публичные данные)
CREATE POLICY "Predictions are publicly readable"
  ON public.predictions FOR SELECT
  USING (true);

-- Только админы могут создавать/изменять/удалять
CREATE POLICY "Admins can insert predictions"
  ON public.predictions FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update predictions"
  ON public.predictions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete predictions"
  ON public.predictions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Доказательства
CREATE TABLE public.prediction_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES public.predictions(id) ON DELETE CASCADE NOT NULL,
  evidence_date DATE NOT NULL,
  note TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.prediction_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Evidence is publicly readable"
  ON public.prediction_evidence FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage evidence"
  ON public.prediction_evidence FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Триггер на updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER predictions_updated_at
  BEFORE UPDATE ON public.predictions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Авто-назначение admin для Andrew.meinhartd@yandex.ru при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'andrew.meinhartd@yandex.ru' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Индексы
CREATE INDEX predictions_status_idx ON public.predictions(status);
CREATE INDEX predictions_display_order_idx ON public.predictions(display_order);
CREATE INDEX prediction_evidence_prediction_id_idx ON public.prediction_evidence(prediction_id);
