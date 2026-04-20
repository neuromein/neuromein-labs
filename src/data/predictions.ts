// Трекер прогнозов NEUROMEIN.ru
// Методология обновления: 1 числа каждого месяца + ad hoc при значимых событиях

export type PredictionStatus =
  | "fulfilled"
  | "partial"
  | "not_fulfilled"
  | "in_progress"
  | "too_early";

export type SourceWork = "silent-replacement" | "ai-2025-forecast" | "new";

export interface Evidence {
  date: string;
  note: string;
  source_url?: string;
}

export interface Prediction {
  id: string;
  title: string;
  statement: string;
  source: {
    work: SourceWork;
    work_title: string;
    section?: string;
    page?: number;
  };
  date_made: string;
  target_horizon: string;
  categories: string[];
  status: PredictionStatus;
  status_updated: string;
  evidence: Evidence[];
  notes?: string;
}

export const CATEGORIES = {
  labor_market: "Рынок труда",
  business_models: "Бизнес-модели",
  ai_models: "Модели ИИ",
  robotics: "Робототехника",
  macroeconomy: "Макроэкономика",
  media_marketing: "Медиа и маркетинг",
  education: "Образование",
  geopolitics: "Геополитика",
  enterprise_ai: "Корпоративный ИИ",
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const STATUS_LABELS: Record<PredictionStatus, string> = {
  fulfilled: "Сбылся",
  partial: "Частично",
  not_fulfilled: "Не сбылся",
  in_progress: "В процессе",
  too_early: "Рано судить",
};

export const SOURCE_LABELS: Record<SourceWork, string> = {
  "silent-replacement": "Тихая замена",
  "ai-2025-forecast": "ИИ в 2025 и прогнозы на 2026",
  "new": "Новые прогнозы",
};

export const predictions: Prediction[] = [
  {
    id: "pred-001",
    title: "Конец эпохи подписок: переход к Agent-as-a-Service",
    statement:
      "В 2026 году классическая парадигма SaaS с оплатой за рабочее место начнёт уступать место модели Agent-as-a-Service, где компании платят за конкретный результат (проверенный контракт, решённый вопрос клиента), а не за лицензию программы.",
    source: { work: "ai-2025-forecast", work_title: "ИИ в 2025 и прогнозы на 2026", section: "2.2", page: 24 },
    date_made: "2026-01-12",
    target_horizon: "конец 2026",
    categories: ["business_models", "enterprise_ai"],
    status: "in_progress",
    status_updated: "2026-04-21",
    evidence: [],
  },
  {
    id: "pred-002",
    title: "Стоимость аутсорсинга снизится на 50%",
    statement:
      "По прогнозу Gartner, в 2026 году цены на аутсорсинг упадут на 50% на фоне перехода к модели Agent-as-a-Service. Общий объём выполняемой работы при этом вырастет взрывообразно за счёт парадокса Джевонса: задачи, которые раньше были нерентабельными, станут массовыми.",
    source: { work: "ai-2025-forecast", work_title: "ИИ в 2025 и прогнозы на 2026", section: "2.2", page: 24 },
    date_made: "2026-01-12",
    target_horizon: "конец 2026",
    categories: ["business_models", "macroeconomy"],
    status: "in_progress",
    status_updated: "2026-04-21",
    evidence: [],
  },
  {
    id: "pred-003",
    title: "Закат SEO: сокращение поискового трафика более чем на 30%",
    statement:
      "В 2026 году объём трафика, переходящего на веб-сайты из поисковых систем, сократится более чем на 30% (Deloitte). Пользователи будут делегировать поиск ответов ИИ. Бренды перейдут от SEO к стратегии GEO (Generative Engine Optimization) — с оптимизации под человеческий глаз к машиночитаемости и интеграции в прямые ответы чат-ботов.",
    source: { work: "ai-2025-forecast", work_title: "ИИ в 2025 и прогнозы на 2026", section: "2.5", page: 30 },
    date_made: "2026-01-12",
    target_horizon: "конец 2026",
    categories: ["media_marketing"],
    status: "in_progress",
    status_updated: "2026-04-21",
    evidence: [],
  },
  {
    id: "pred-004",
    title: "«Ловушка джуниора» на рынке труда",
    statement:
      "В 2026 году произойдёт кризис начальных позиций. ИИ заменит задачи, через которые молодые специалисты входили в профессию (программирование, клиентская поддержка, финансовый анализ), что разорвёт цепочку передачи опыта между поколениями.",
    source: { work: "ai-2025-forecast", work_title: "ИИ в 2025 и прогнозы на 2026", section: "2.3", page: 26 },
    date_made: "2026-01-12",
    target_horizon: "в течение 2026",
    categories: ["labor_market", "education"],
    status: "in_progress",
    status_updated: "2026-04-21",
    evidence: [
      {
        date: "2026-02-01",
        note: "Исследование Stanford Digital Economy Lab: снижение темпа трудоустройства на 14% среди работников 22–25 лет в профессиях, затронутых ИИ.",
      },
    ],
  },
  {
    id: "pred-005",
    title: "Девальвация дипломов и переход к экономике портфолио",
    statement:
      "В 2026 году работодатели начнут систематически отдавать приоритет верифицируемому портфолио над академическими дипломами даже ведущих вузов. Классические институты рискуют превратиться в устаревшие «фабрики дипломов», а реальную ценность начнут генерировать «акселераторы агентности».",
    source: { work: "ai-2025-forecast", work_title: "ИИ в 2025 и прогнозы на 2026", section: "2.3", page: 26 },
    date_made: "2026-01-12",
    target_horizon: "в течение 2026",
    categories: ["education", "labor_market"],
    status: "too_early",
    status_updated: "2026-04-21",
    evidence: [],
    notes:
      "Тренд сложно измерить количественно; по данным Randstad Workmonitor 2026, вакансии с навыками работы с ИИ-агентами выросли на 1587% за 2025.",
  },
  {
    id: "pred-006",
    title: "Год «физического ИИ»",
    statement:
      "2026 станет годом массового воплощения ИИ в робототехнике и автономных системах. Облачная робототехника станет новой моделью автономности: тяжёлые вычисления — в облаке, исполнение — на устройстве. Военное применение робототехники получит ускоренное развитие.",
    source: { work: "ai-2025-forecast", work_title: "ИИ в 2025 и прогнозы на 2026", section: "2.4", page: 29 },
    date_made: "2026-01-12",
    target_horizon: "конец 2026",
    categories: ["robotics"],
    status: "in_progress",
    status_updated: "2026-04-21",
    evidence: [],
  },
  {
    id: "pred-007",
    title: "«Китайский парадокс»: паритет открытых моделей",
    statement:
      "Санкционное давление на Китай в 2026 году породит сверхэффективные альтернативные архитектуры (тернарные веса, малые модели), которые зададут новые стандарты оптимизации и достигнут паритета с западными проприетарными моделями при стоимости вывода в десятки раз ниже.",
    source: { work: "ai-2025-forecast", work_title: "ИИ в 2025 и прогнозы на 2026", section: "2.1", page: 21 },
    date_made: "2026-01-12",
    target_horizon: "в течение 2026",
    categories: ["ai_models", "geopolitics"],
    status: "partial",
    status_updated: "2026-04-21",
    evidence: [
      {
        date: "2026-04-01",
        note: "DeepSeek V4 достиг паритета с западными аналогами при стоимости вывода в десятки раз ниже.",
      },
    ],
  },
  {
    id: "pred-008",
    title: "L-образная рецессия в США: вероятность 25%",
    statement:
      "По оценкам J.P. Morgan, вероятность краткосрочной рецессии в США в 2026 году составляет 25%. При реализации: пузырь на фондовом рынке лопнет, экономика потеряет 1.2 млн рабочих мест, безработица вырастет до 7.2%. Альтернативный сценарий Robeco (35% вероятности) — стагфляция, перерастающая в глобальную рецессию.",
    source: { work: "ai-2025-forecast", work_title: "ИИ в 2025 и прогнозы на 2026", section: "2.7", page: 34 },
    date_made: "2026-01-12",
    target_horizon: "до конца 2026",
    categories: ["macroeconomy", "labor_market"],
    status: "in_progress",
    status_updated: "2026-04-21",
    evidence: [],
  },
  {
    id: "pred-009",
    title: "Временная шкала кризисов 2026–2027",
    statement:
      "Первоначальный прогноз: коррекция в tech-секторе во II–III квартале 2026 года, геополитическое обострение к IV кварталу 2026, рецессия к середине 2027-го.",
    source: { work: "silent-replacement", work_title: "Тихая замена", section: "6.3", page: 44 },
    date_made: "2026-03-15",
    target_horizon: "Q2 2026 — середина 2027",
    categories: ["macroeconomy", "labor_market", "geopolitics"],
    status: "partial",
    status_updated: "2026-04-21",
    evidence: [
      {
        date: "2026-02-01",
        note: "Технологическая коррекция и кредитный шок в софтверном секторе произошли в январе–феврале 2026, до Q2.",
      },
      {
        date: "2026-02-28",
        note: "Война в Иране началась 28 февраля 2026 — геополитическое обострение произошло раньше Q4, одновременно с tech-коррекцией.",
      },
    ],
    notes:
      "Направление прогноза подтверждено, но реальность опередила сроки — кризисы, разнесённые в прогнозе на кварталы, наложились в пределах недель. Это расхождение зафиксировано автором в разделе 6.3 работы.",
  },
  {
    id: "pred-010",
    title: "Рынок труда превращается в «гантель»",
    statement:
      "К 2028 году рынок труда трансформируется из пирамиды в гантель: на одном конце — небольшое количество высокооплачиваемых специалистов, управляющих ИИ-сотрудниками; на другом — массовые позиции, которые сложно автоматизировать (уход за людьми, ручной труд в нестандартных условиях). Между ними — пустота для менеджеров, аналитиков, маркетологов, бухгалтеров, программистов, юристов, рекрутеров.",
    source: { work: "silent-replacement", work_title: "Тихая замена", section: "Глава 7" },
    date_made: "2026-03-15",
    target_horizon: "до 2028",
    categories: ["labor_market"],
    status: "too_early",
    status_updated: "2026-04-21",
    evidence: [],
  },
  {
    id: "pred-011",
    title: "Гуманоидные роботы дешевле годовой зарплаты",
    statement:
      "За горизонтом 2028 года стоимость гуманоидных роботов от Tesla, Figure AI, Boston Dynamics, Unitree Robotics опустится ниже годовой зарплаты складского рабочего. Это создаст давление на нижнюю перекладину «гантели» — массовый физический труд.",
    source: { work: "silent-replacement", work_title: "Тихая замена", section: "Глава 7" },
    date_made: "2026-03-15",
    target_horizon: "2028+",
    categories: ["robotics", "labor_market"],
    status: "too_early",
    status_updated: "2026-04-21",
    evidence: [],
  },
  {
    id: "pred-012",
    title: "Необратимость кризисных сокращений",
    statement:
      "Компании, сократившие персонал во время кризиса 2026–2028, не вернут людей после восстановления экономики. Освободившиеся позиции займут ИИ-сотрудники. Окно между увольнением и восстановлением, раньше составлявшее 12–18 месяцев, закроется — к моменту восстановления позиции уже будут заняты.",
    source: { work: "silent-replacement", work_title: "Тихая замена", section: "3.4, 6.3" },
    date_made: "2026-03-15",
    target_horizon: "2027–2029 (фаза восстановления)",
    categories: ["labor_market", "macroeconomy"],
    status: "too_early",
    status_updated: "2026-04-21",
    evidence: [],
  },
];

export function getStats(items: Prediction[] = predictions) {
  const total = items.length;
  const byStatus = items.reduce<Record<PredictionStatus, number>>(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    { fulfilled: 0, partial: 0, not_fulfilled: 0, in_progress: 0, too_early: 0 },
  );
  const settled = byStatus.fulfilled + byStatus.partial + byStatus.not_fulfilled;
  const accuracy =
    settled > 0
      ? Math.round(((byStatus.fulfilled + byStatus.partial * 0.5) / settled) * 100)
      : null;
  return { total, byStatus, settled, accuracy };
}
