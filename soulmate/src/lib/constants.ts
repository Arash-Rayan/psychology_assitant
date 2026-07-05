import type {
  AIRecommendation,
  AnalyticsPeriod,
  BookItem,
  GoalProgress,
  HourlyTask,
  InsightItem,
  JournalTopic,
  PeopleProfile,
  RadarDimension,
  WeekDay,
} from "./types";

export const PRODUCT = {
  name: "سول‌میت",
  nameEn: "Soulmate",
  tagline: "تقویم هوشمند AI — برنامه روز، تحلیل پیشرفت، و همراه رشد شخصی",
  company: "روانصد",
  companyEn: "RavanSad",
} as const;

export const SIDEBAR_NAV = [
  { href: "/dashboard", label: "خانه", icon: "home" },
  { href: "/planner", label: "برنامه‌ریز", icon: "planner" },
  { href: "/journal", label: "گفتگو با AI", icon: "chat" },
  { href: "/analytics", label: "تحلیل", icon: "chart" },
  { href: "/insights", label: "بینش AI", icon: "sparkles" },
  { href: "/taste", label: "کتاب و سلیقه", icon: "book" },
  { href: "/people", label: "هم‌مسیرها", icon: "users" },
] as const;

export const MOCK_HOURLY_TASKS: HourlyTask[] = [
  { id: "h1", time: "۰۸:۰۰", endTime: "۱۰:۰۰", title: "کار عمیق — پایان‌نامه", done: true, tag: "تمرکز", tagColor: "#8b5cf6", category: "focus" },
  { id: "h2", time: "۱۰:۳۰", endTime: "۱۲:۰۰", title: "مرور آمار — فصل ۴", done: true, tag: "مطالعه", tagColor: "#22d3ee", category: "study" },
  { id: "h3", time: "۱۲:۳۰", title: "ناهار + استراحت", done: true, tag: "استراحت", tagColor: "#fb923c", category: "rest" },
  { id: "h4", time: "۱۴:۰۰", endTime: "۱۵:۳۰", title: "جلسه هم‌درس", done: false, tag: "اجتماعی", tagColor: "#ec4899", category: "social" },
  { id: "h5", time: "۱۶:۰۰", endTime: "۱۷:۰۰", title: "باشگاه", done: false, tag: "سلامت", tagColor: "#34d399", category: "health" },
  { id: "h6", time: "۱۹:۰۰", endTime: "۲۰:۰۰", title: "نوشتن journal — اضطراب امتحان", done: false, tag: "بازتاب", tagColor: "#a78bfa", category: "creative" },
  { id: "h7", time: "۲۱:۰۰", title: "۲۰ صفحه «عادت اتمی»", done: false, tag: "کتاب", tagColor: "#6366f1", category: "study" },
];

export const MOCK_DAY_PROGRESS = {
  completed: 3,
  total: 7,
  focusMinutes: 225,
  productivity: 87,
};

export const MOCK_WEEK_STRIP: WeekDay[] = [
  { label: "ش", date: 25, isToday: false, productivity: 72 },
  { label: "ی", date: 26, isToday: false, productivity: 85 },
  { label: "د", date: 27, isToday: false, productivity: 68 },
  { label: "س", date: 28, isToday: false, productivity: 91 },
  { label: "چ", date: 29, isToday: true, productivity: 87 },
  { label: "پ", date: 30, isToday: false },
  { label: "ج", date: 31, isToday: false },
];

export const MOCK_RADAR: RadarDimension[] = [
  { label: "بهره‌وری", value: 87 },
  { label: "تمرکز", value: 82 },
  { label: "سلامت", value: 74 },
  { label: "یادگیری", value: 90 },
  { label: "ثبات", value: 78 },
  { label: "آرامش", value: 65 },
];

export const MOCK_INSIGHTS: InsightItem[] = [
  { id: "s1", type: "strength", text: "ثبات عالی — ۵ روز متوالی برنامه صبح را رعایت کردی" },
  { id: "s2", type: "strength", text: "تمرکز عمیق — میانگین ۹۰ دقیقه بدون وقفه" },
  { id: "w1", type: "weakness", text: "برنامه خواب — ۳ شب خواب کمتر از ۶ ساعت" },
  { id: "w2", type: "weakness", text: "Overcommitment — ۲ کار عقب افتاده در هفته" },
  { id: "g1", type: "suggestion", text: "فردا کارهای سنگین را ۸–۱۰ صبح بگذار — پیک بهره‌وری تو" },
];

export const MOCK_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: "r1",
    kind: "book",
    title: "The 5 AM Club",
    subtitle: "Robin Sharma",
    reason: "برای هدف «صبح productive» و ضعف خواب — روتین صبحگاهی ساختاریافته",
    tag: "پیشنهاد AI",
  },
  {
    id: "r2",
    kind: "podcast",
    title: "Huberman Lab — Anxiety Toolkit",
    subtitle: "Andrew Huberman",
    reason: "بر اساس journal امروز درباره اضطراب امتحان",
    tag: "podcast",
  },
  {
    id: "r3",
    kind: "note",
    title: "یادداشت: الگوی overcommitment",
    subtitle: "بینش AI",
    reason: "۳ هفته متوالی بیش از ۷ task/روز — پیشنهاد حداکثر ۵ اولویت",
    tag: "ضعف",
  },
];

export const MOCK_GOALS: GoalProgress[] = [
  { id: "g1", title: "دفاع پایان‌نامه", current: 45, target: 100, unit: "٪", deadline: "شهریور ۱۴۰۴" },
  { id: "g2", title: "کتاب non-fiction", current: 3, target: 12, unit: "کتاب", deadline: "اسفند ۱۴۰۴" },
  { id: "g3", title: "streak مدیتیشن", current: 12, target: 30, unit: "روز", deadline: "۳۰ روز" },
];

export const MOCK_ANALYTICS = {
  week: {
    label: "این هفته",
    productivity: 81,
    tasksDone: 23,
    tasksTotal: 27,
    trend: "up" as const,
    trendPercent: 12,
    focusHours: 18.75,
    chartData: [72, 85, 68, 91, 87, 0, 0],
  } satisfies AnalyticsPeriod,
  month: {
    label: "خرداد ۱۴۰۴",
    productivity: 76,
    tasksDone: 89,
    tasksTotal: 112,
    trend: "down" as const,
    trendPercent: 5,
    focusHours: 62,
    chartData: [70, 74, 78, 76, 72, 80, 75, 79, 76, 73, 78, 76, 74, 77, 76, 72, 78, 80, 75, 73, 76, 74, 78, 76, 79, 75, 73, 76, 78, 76],
  } satisfies AnalyticsPeriod,
  year: {
    label: "۱۴۰۴",
    productivity: 78,
    tasksDone: 412,
    tasksTotal: 520,
    trend: "up" as const,
    trendPercent: 18,
    focusHours: 680,
    chartData: [65, 68, 72, 75, 78, 80, 82, 78, 76, 79, 81, 78],
  } satisfies AnalyticsPeriod,
};

export const JOURNAL_TOPICS: JournalTopic[] = [
  { id: "stress", label: "استرس و اضطراب", emoji: "🧠", prompt: "امروز چه چیزی بیشتر ذهنت را مشغول کرد؟" },
  { id: "interests", label: "علایق — موسیقی، فلسفه", emoji: "🎵", prompt: "درباره موسیقی، فلسفه، یا هر چیز دیگری بنویس..." },
  { id: "plans", label: "برنامه و اهداف", emoji: "🎯", prompt: "اهداف این هفته/ماه چیست؟ چه چیزی موانع است؟" },
  { id: "mood", label: "حال و انرژی", emoji: "⚡", prompt: "امروز انرژیت چطور بود؟ چه زمانی بهتر بود؟" },
];

export const MOCK_CHAT = [
  { id: "1", role: "assistant" as const, content: "سلام رایان 👋 من دستیار سول‌میتم. می‌توانی درباره استرس، علایق (موسیقی، فلسفه)، یا برنامه‌ات صحبت کنی. امروز ۳ از ۷ کار انجام شده — می‌خواهی برنامه عصر را تنظیم کنیم؟" },
];

export const MOCK_BOOKS: BookItem[] = [
  { id: "b1", title: "عادت اتمی", author: "James Clear", status: "reading", progress: 62, genre: "عادت" },
  { id: "b2", title: "The 5 AM Club", author: "Robin Sharma", status: "want", genre: "بهره‌وری" },
  { id: "b3", title: "مدیتیشن و ذهن", author: "Sam Harris", status: "want", genre: "فلسفه/ذهن" },
];

export const MOCK_PEOPLE: PeopleProfile[] = [
  {
    id: "1",
    name: "سارا",
    city: "تهران",
    purpose: "هم‌درس آمار",
    sharedGoals: ["فصل ۴ آمار", "جلسه هفتگی"],
    sharedHabits: ["مطالعه ۸–۱۰", "journal شب"],
    sharedTastes: ["عادت اتمی", "Lo-fi"],
    overlapScore: 88,
    overlapReasons: ["ریتم مطالعه مشترک", "اضطراب امتحان مشابه — accountability"],
    avatarInitial: "س",
    activeHours: "۸–۱۲",
  },
];

export const HOUR_SLOTS = [
  "۰۶:۰۰", "۰۷:۰۰", "۰۸:۰۰", "۰۹:۰۰", "۱۰:۰۰", "۱۱:۰۰", "۱۲:۰۰",
  "۱۳:۰۰", "۱۴:۰۰", "۱۵:۰۰", "۱۶:۰۰", "۱۷:۰۰", "۱۸:۰۰", "۱۹:۰۰",
  "۲۰:۰۰", "۲۱:۰۰", "۲۲:۰۰", "۲۳:۰۰",
];
