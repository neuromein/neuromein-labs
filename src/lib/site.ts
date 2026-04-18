export const SITE = {
  name: "NEUROMEIN",
  author: "Андрей Майнгардт",
  url: "https://neuromein.ru",
  description:
    "Независимый аналитический ресурс об искусственном интеллекте и рынке труда. Автор — Андрей Майнгардт.",
  telegram: "https://t.me/neuromein",
  telegramHandle: "t.me/neuromein",
  linkedin: "https://linkedin.com/in/andrew-meinhardt-306821361",
  instagram: "@neuromein.ai",
  email: "andrew.meinhardt@yandex.ru",
  telegramPersonal: "@andrew_meinhardt",
};

export const NAV_LINKS = [
  { to: "/research" as const, label: "Исследования" },
  { to: "/predictions" as const, label: "Прогнозы" },
  { to: "/blog" as const, label: "Публикации" },
  { to: "/faq" as const, label: "FAQ" },
  { to: "/about" as const, label: "О себе" },
];

export type Publication = {
  slug: string;
  date: string;
  dateLabel: string;
  title: string;
  tag: string;
  excerpt: string;
};

export const PUBLICATIONS: Publication[] = [
  {
    slug: "ai-jobs-shift-2026",
    date: "2026-03-12",
    dateLabel: "12 марта 2026",
    title: "Куда уходят младшие аналитики: разбор данных за первый квартал",
    tag: "ИИ и работа",
    excerpt:
      "Сводный анализ изменений в найме на позиции junior-уровня в технологических компаниях за начало 2026 года.",
  },
  {
    slug: "agentic-ai-enterprise",
    date: "2026-02-20",
    dateLabel: "20 февраля 2026",
    title: "Агентные системы в корпорациях: что реально работает",
    tag: "Разбор",
    excerpt:
      "Кейсы внедрения автономных AI-агентов в банках, ритейле и логистике — без маркетинговой шелухи.",
  },
  {
    slug: "prediction-q1-review",
    date: "2026-01-30",
    dateLabel: "30 января 2026",
    title: "Сверка прогнозов на 2026: первая контрольная точка",
    tag: "Прогнозы",
    excerpt:
      "Возвращаюсь к январским прогнозам и проверяю, какие из них уже подтвердились, а какие — нет.",
  },
  {
    slug: "skill-erosion",
    date: "2025-12-18",
    dateLabel: "18 декабря 2025",
    title: "Эрозия навыков: как ИИ меняет содержание профессии изнутри",
    tag: "Мнение",
    excerpt:
      "Профессия может выглядеть прежней, но её внутренняя структура меняется быстрее, чем кажется.",
  },
  {
    slug: "ai-2025-summary",
    date: "2025-12-05",
    dateLabel: "5 декабря 2025",
    title: "Главные сдвиги в ИИ за 2025 год: краткий обзор",
    tag: "Разбор",
    excerpt:
      "Шесть событий, которые определят повестку 2026 года — от инфраструктуры до регулирования.",
  },
];

export const TAGS = ["Все", "ИИ и работа", "Прогнозы", "Разбор", "Мнение"] as const;

export type Prediction = {
  id: string;
  statement: string;
  madeOn: string;
  checkBy: string;
  status: "confirmed" | "partial" | "in_progress" | "not_confirmed";
  source: string;
  sourceUrl: string;
};

export const PREDICTIONS: Prediction[] = [
  {
    id: "p1",
    statement:
      "К концу 2025 года не менее трёх крупных российских компаний публично откажутся от найма копирайтеров начального уровня в пользу AI-инструментов.",
    madeOn: "Январь 2025",
    checkBy: "Декабрь 2025",
    status: "confirmed",
    source: "Telegram NEUROMEIN",
    sourceUrl: "https://t.me/neuromein",
  },
  {
    id: "p2",
    statement:
      "В 2026 году объём вакансий на позиции «AI-стратег» и «AI-интегратор» в РФ превысит число вакансий junior data analyst.",
    madeOn: "Март 2025",
    checkBy: "Декабрь 2026",
    status: "in_progress",
    source: "Исследование «Тихая замена»",
    sourceUrl: "/research/silent-replacement",
  },
  {
    id: "p3",
    statement:
      "К середине 2026 года стоимость inference моделей уровня GPT-4 упадёт минимум в 5 раз относительно начала 2025 года.",
    madeOn: "Февраль 2025",
    checkBy: "Июль 2026",
    status: "partial",
    source: "Отчёт «ИИ в 2025»",
    sourceUrl: "/research/ai-2025-forecast",
  },
  {
    id: "p4",
    statement:
      "Появится первый публичный кейс российского банка, где AI-агенты автономно ведут весь цикл клиентской поддержки физлиц.",
    madeOn: "Май 2025",
    checkBy: "Декабрь 2026",
    status: "in_progress",
    source: "Telegram NEUROMEIN",
    sourceUrl: "https://t.me/neuromein",
  },
  {
    id: "p5",
    statement:
      "В 2025 году появится единый отраслевой стандарт раскрытия использования генеративного ИИ в публикациях СМИ.",
    madeOn: "Январь 2025",
    checkBy: "Декабрь 2025",
    status: "not_confirmed",
    source: "Публичная заметка",
    sourceUrl: "https://t.me/neuromein",
  },
];

export const RESEARCH = [
  {
    slug: "silent-replacement",
    eyebrow: "ИССЛЕДОВАНИЕ",
    dotColor: "var(--color-brand)",
    title: "Тихая замена",
    year: "2025",
    date: "Октябрь 2025",
    readTime: "22 мин чтения",
    short:
      "Как ИИ-автоматизация незаметно замещает рабочие функции — и почему это важнее, чем массовые увольнения.",
    long: "Аналитическое исследование о том, как ИИ-автоматизация постепенно замещает рабочие функции внутри существующих должностей. Не через массовые увольнения, а через тихое перераспределение задач. Исследование охватывает горизонт 2026–2028 и разбирает конкретные профессии, сценарии и рекомендации для бизнеса.",
    summary:
      "Исследование описывает механику «тихой замены» — процесса, при котором ИИ берёт на себя отдельные функции внутри должности, не приводя к формальному сокращению, но постепенно обесценивая позицию. На основе анализа 42 ролей в 6 индустриях выделены типовые сценарии, сроки и риски. В заключении — практические шаги для бизнеса и специалистов на горизонте 2026–2028.",
    toc: [
      { id: "intro", label: "Введение" },
      { id: "mechanics", label: "Механика тихой замены" },
      { id: "professions", label: "Затронутые профессии" },
      { id: "scenarios", label: "Сценарии 2026–2028" },
      { id: "recommendations", label: "Рекомендации" },
    ],
  },
  {
    slug: "ai-2025-forecast",
    eyebrow: "ОТЧЁТ",
    dotColor: "oklch(0.78 0.10 250)",
    title: "ИИ в 2025 и прогнозы на 2026",
    year: "2025",
    date: "Декабрь 2025",
    readTime: "28 мин чтения",
    short:
      "Полный анализ ключевых трендов ИИ за 2025 год и набор проверяемых прогнозов на 2026.",
    long: "Полный отчёт по ключевым трендам искусственного интеллекта за 2025 год. Анализ основных событий, технологических прорывов, рыночных сдвигов — и набор конкретных проверяемых прогнозов на 2026 год.",
    summary:
      "Отчёт суммирует главные технологические и рыночные сдвиги в области ИИ за 2025 год: рост агентных систем, удешевление inference, изменения в регулировании, сдвиги на рынке труда. Вторая часть — 14 конкретных прогнозов на 2026 год с датами проверки и критериями подтверждения.",
    toc: [
      { id: "intro", label: "Введение" },
      { id: "trends-2025", label: "Главные сдвиги 2025" },
      { id: "infra", label: "Инфраструктура и стоимость" },
      { id: "labor", label: "Рынок труда" },
      { id: "forecast-2026", label: "Прогнозы на 2026" },
    ],
  },
] as const;
