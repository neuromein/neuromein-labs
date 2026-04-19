export const SITE = {
  name: "NEUROMEIN",
  author: "Андрей Майнгардт",
  url: "https://neuromein.ru",
  description:
    "Аналитический ресурс об искусственном интеллекте и рынке труда. Автор — Андрей Майнгардт, AI-стратег и аналитик.",
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

export const PUBLICATIONS: Publication[] = [];

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
    year: "2026",
    date: "Март 2026",
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
    year: "2026",
    date: "Январь 2026",
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
