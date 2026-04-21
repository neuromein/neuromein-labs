

# Раздел «Прогнозы» — критический разбор и план апгрейда до уровня топ-студий

## Честная оценка текущего состояния

**Что сделано хорошо (7/10):**
- Дуговая шкала времени — оригинальная идея, не банальная горизонтальная полоса
- Indigo→Cyan градиент в духе Linear/Arc — современно
- Glassmorphism карточки с aurora-glow — аккуратно
- Pill-фильтры с `layoutId` анимацией — отлично

**Где видно «руку ИИ», а не топ-студию:**

1. **Перегруз эффектами.** Одновременно: glassmorphism + aurora-orbs (Layout) + arc-glow + dotGlow filter + crisis ROSE glow + card aurora + gradient-текст. Топ-студии (Linear, Vercel, Stripe, Anthropic) используют **один** сильный визуальный приём, а не пять одновременно.
2. **Градиент Indigo→Cyan везде** — стал визуальным шумом. На дуге, в pill, в точках, в тексте, в аватарах. Студии типа Pentagram применяют акцент скупо: 1 место на экран.
3. **Дуга = декорация, не информация.** Точки на дуге не несут смысла кроме «квартал N». Расстояния равны, форма не отражает плотности или intensity. Это «красиво ради красиво» — главный AI-tell.
4. **Карточки одинаковые.** 16 prediction-карточек в сетке 4×4 с identical layout = безличный grid. У Bloomberg/NYT/Pitch важные прогнозы выделены размером (bento-grid).
5. **Нет иерархии истории.** Прогнозы — это нарратив о будущем, а сейчас это каталог. Нет «hero prediction», нет featured, нет связей между ними.
6. **«Зона кризиса» не объяснена визуально** — просто розовая дуга без контекста почему именно эти кварталы.
7. **Confidence pill = серая капсула с %** — мертвая. У Anthropic/OpenAI confidence визуализируется как заполненный круг, штриховка или толщина.
8. **Stat tiles внизу — generic dashboard.** «Всего / Сбылось / Частично» — это admin-панель, а не editorial.
9. **Отсутствует SEO/AI-readability слой.** Нет JSON-LD `Dataset`/`ClaimReview`/`Article`, нет семантических `<time datetime>`, нет breadcrumbs schema. ИИ-краулерам (Perplexity, ChatGPT, Claude) нечего цитировать структурированно.

---

## План улучшений: 4 направления

### 1. Hero — editorial-заявление вместо «Прогнозы 2026–2028 и их проверка»

Сейчас заголовок + параграф = generic. Добавить:
- **Огромную живую метрику** в духе FT/Stratechery: «**16 прогнозов** · горизонт **3 года** · точность **—** (первая сверка Q3 2026)»
- Eyebrow-тег `PUBLIC PREDICTION TRACKER · v2.0` мелким моно-шрифтом
- Подзаголовок переписать в первое лицо: «Я фиксирую публично. Через 3, 6, 12 месяцев — проверяю. Без правок задним числом.»
- Tabular nums + JetBrains Mono для чисел — даёт «editorial data» вайб

### 2. Timeline — превратить декорацию в информационную графику

**Убрать:** дуга-радуга с glow-обводками. **Заменить на:**
- **Горизонтальный stream-chart** (как у The Pudding / NYT): высота столбца = количество прогнозов в квартале, цвет = доминирующая тема. Пользователь сразу видит «когда основная плотность событий».
- Кризисные зоны — не отдельная розовая линия, а **затенённая вертикальная band** под графиком с подписью «Зона предсказанного кризиса · по «Тихой замене», гл. 6.3» — теперь это объясняет, а не украшает.
- Hover на квартал — не popover-окно, а **подсветка соответствующих карточек ниже** (cross-filter, как у Linear changelog).
- Сверху над графиком — мини-легенда тем 5 цветами вместо одного градиента везде.

### 3. Cards grid → editorial bento-layout

Вместо однородной 4-колоночной сетки:
- **Hero-карточка** (2×2) для самого важного прогноза квартала с большим заголовком, цитатой из исследования и mini-chart confidence
- **Standard карточки** (1×1) для остальных
- **Connection карточки** (1×2 горизонтальные) — для прогнозов, которые вытекают друг из друга («pred-007 → pred-010»)
- **Confidence как визуал**: вместо «%» — горизонтальная штриховка из 10 рисок, заполненных на N (как сейсмограф), под заголовком карточки. Ещё лучше — radial gauge 60×60.
- Каждая карточка получает **eyebrow с темой** маленьким моно-шрифтом, окрашенным в цвет темы (5 цветов вместо одного градиента).
- Убрать identical hover-aurora-glow с каждой карточки. Оставить только `y: -2` и тонкую border-подсветку.

### 4. Stats footer → «Track record» секция уровня Stratechery

Сейчас 6 одинаковых тайлов. Заменить на:
- Большая надпись слева: «**Точность пока не измерена**» + объяснение «Первая публичная сверка — Q3 2026. До тех пор все прогнозы в статусе in_progress / too_early.»
- Справа — компактная distribution-полоска (как health-bar) показывающая статусы в одну строку
- Снизу — **timeline of next checkpoint dates**: «01.07.2026 — следующая сверка», «01.10.2026 — Q3-обновление»
- Это создаёт ощущение **обязательства**, а не статичной витрины

---

## SEO + AI-discoverability layer (для попадания в рекомендации Perplexity/ChatGPT/Claude)

Самое важное и пока отсутствующее. Добавить в `routes/predictions.tsx`:

1. **JSON-LD `Dataset` schema** в `head()` — описывает тракер как датасет с лицензией, автором, датой обновления
2. **JSON-LD `Article` + `ClaimReview`** для каждого прогноза — это формат, который Google и AI-движки явно понимают как «верифицируемое утверждение»
3. **`<time datetime="2026-Q1">`** на каждой дате — машиночитаемые временные метки
4. **`<article itemscope itemtype="ClaimReview">`** на карточках вместо `<div>`
5. **OpenGraph image** — сгенерировать статичную SVG-карточку для `/predictions` с превью (горизонт + 16 прогнозов + автор) и положить в `public/og/predictions.png`
6. **`<link rel="alternate" type="application/json" href="/api/predictions.json">`** — машиночитаемая версия датасета (создать API-роут возвращающий predictions[] как JSON). Топ-показатель «AI-friendliness»: Perplexity и Claude явно отдают предпочтение сайтам с публичным JSON-feed.
7. **Breadcrumbs schema** + видимые breadcrumbs в UI: Главная › Прогнозы
8. **Обновить `public/llms.txt`** — добавить раздел «Predictions tracker» с явным описанием для LLM-краулеров: что это, как обновляется, как цитировать

---

## Что НЕ трогаем (работает хорошо)
- Цветовая палитра Indigo→Cyan как акцент (но применяем скупо)
- Filter-pills с `layoutId` анимацией
- Modal с детализацией prediction
- Mobile quarter-list — отличная альтернатива дуге

---

## Технические детали реализации

**Новые/изменяемые файлы:**
- `src/components/PredictionsTimeline.tsx` — заменить `ArcSvg` на `StreamChart`, переписать grid как bento, заменить ConfidencePill на ConfidenceGauge
- `src/components/PredictionsHero.tsx` — новый компонент editorial-hero с большой метрикой
- `src/components/PredictionsTrackRecord.tsx` — новый компонент вместо StatTile-сетки
- `src/components/ConfidenceGauge.tsx` — radial gauge компонент
- `src/routes/predictions.tsx` — добавить JSON-LD schemas (Dataset + ClaimReview×N + BreadcrumbList) в `head()`
- `src/routes/api.predictions.json.ts` — новый API endpoint, отдающий predictions как JSON для LLM-краулеров
- `public/llms.txt` — обновить с разделом про tracker
- `public/og/predictions.png` — добавить готовое OG-превью (либо генерация на лету через server-route)

**Темы и цвета** (для editorial color-coding по темам):
```text
labor       → #6366F1 (indigo)
tech_ai     → #22D3EE (cyan)
geo_crises  → #F43F5E (rose)
bio_health  → #10B981 (emerald)
society_edu → #F59E0B (amber)
```

**Бенчмарки референсов** (что воспроизводим):
- Stripe `/atlas` — editorial bento, скупой акцент
- Linear `/changelog` — cross-filter взаимодействие
- Stratechery — визуализация tracking record
- The Pudding — stream-chart timeline
- FT/NYT data-journalism — typography для чисел

---

## Ожидаемый эффект

**До:** «красивый AI-сайт с глассморфизмом и градиентом»
**После:** «editorial prediction tracker, который явно сделал человек с мнением»

WAU-эффект достигается **через содержание + сдержанность визуального языка**, а не через ещё больше градиентов. AI-discoverability — через структурированные данные и публичный JSON-feed, что напрямую увеличит вероятность цитирования в Perplexity/ChatGPT/Claude.

**Готов реализовать всё это в 3 коммита:**
1. JSON-LD + llms.txt + JSON API endpoint (SEO/AI-слой — quick win)
2. Hero + Track Record (editorial-обёртка)
3. Stream-chart timeline + bento-grid + ConfidenceGauge (главный визуальный апгрейд)

Если согласен — начну с шага 1 (наименьший риск, наибольший SEO-эффект), затем 2, затем 3. Или скажи, какой шаг приоритетнее.

