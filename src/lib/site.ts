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

import coverSilent from "@/assets/cover-silent-replacement.png";
import coverForecast from "@/assets/cover-ai-2025-forecast.png";

export const RESEARCH = [
  {
    slug: "silent-replacement",
    eyebrow: "ИССЛЕДОВАНИЕ",
    title: "Тихая замена",
    subtitle: "Как кризисы 2026–2028 изменят рынок труда навсегда",
    year: "2026",
    date: "Март 2026",
    pages: 67,
    cover: coverSilent,
    pdf: "/research/tihaya-zamena.pdf",
    short:
      "Как ИИ-автоматизация незаметно замещает рабочие функции — и почему это важнее, чем массовые увольнения.",
    long: "Аналитическое исследование о том, как ИИ-автоматизация постепенно замещает рабочие функции внутри существующих должностей. Не через массовые увольнения, а через тихое перераспределение задач. Исследование охватывает горизонт 2026–2028 и разбирает конкретные профессии, сценарии и рекомендации для бизнеса.",
    summary:
      "Технологические гиганты строят крупнейшую инфраструктуру в истории — на 2026 год около $635–665 млрд капитальных затрат у четырёх гиперскейлеров. При этом 95% корпоративных проектов на основе генеративного ИИ пока не принесли измеримой финансовой отдачи. Единственный масштабный способ окупить триллионы — массовое внедрение ИИ-сотрудников в бизнес-процессы. Исследование разбирает, почему «тихая замена» неизбежна в горизонте 2026–2028, какие профессии затронет первыми и что с этим делать сотрудникам, бизнесу и регуляторам.",
    toc: [
      { id: "ch1", label: "Глава 1. Точка отсчёта. Февраль 2026" },
      { id: "ch2", label: "Глава 2. Механизм замены" },
      { id: "ch3", label: "Глава 3. ИИ-пузырь и рецессия" },
      { id: "ch4", label: "Глава 4. Военные конфликты" },
      { id: "ch5", label: "Глава 5. Пандемия" },
      { id: "ch6", label: "Глава 6. Идеальный шторм" },
      { id: "ch7", label: "Глава 7. Кто выигрывает, кто проигрывает" },
      { id: "ch8", label: "Глава 8. Что может пойти не так" },
      { id: "ch9", label: "Глава 9. Что делать?" },
      { id: "ch10", label: "Глава 10. Чего не делать?" },
    ],
  },
  {
    slug: "ai-2025-forecast",
    eyebrow: "ОТЧЁТ",
    title: "ИИ в 2025 и прогнозы на 2026",
    subtitle: "Структурный слом индустрии и карта трендов следующего года",
    year: "2026",
    date: "Январь 2026",
    pages: 43,
    cover: coverForecast,
    pdf: "/research/ai-2025-forecast.pdf",
    short:
      "Полный анализ ключевых трендов ИИ за 2025 год и набор проверяемых прогнозов на 2026.",
    long: "Полный отчёт по ключевым трендам искусственного интеллекта за 2025 год. Анализ основных событий, технологических прорывов, рыночных сдвигов — и набор конкретных проверяемых прогнозов на 2026 год.",
    summary:
      "2025 год стал моментом структурного слома индустрии: период «романтического евангелизма» сменился фазой жёсткого аудита и прагматичной интеграции. OpenAI утратила монополию (доля упала до 27%), Anthropic с Claude Opus 4.5 захватила 40% корпоративного сегмента, стоимость обработки токенов упала в 280 раз. Отчёт фиксирует главные сдвиги 2025 года в мире и в России и даёт карту трендов на 2026: от Agent-as-a-Service и «ловушки джуниора» до Q-Day и кризиса «вайб-кодинга».",
    toc: [
      { id: "ch1", label: "Глава 1. Трансформация рынка ИИ в 2025" },
      { id: "ch2", label: "Глава 2. Прогноз на 2026 год" },
      { id: "ch3", label: "Глава 3. Что делать бизнесу в 2026" },
    ],
  },
] as const;
