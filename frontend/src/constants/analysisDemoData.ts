import type { AnalysisAgentId } from '@/constants/analysisAgents';
import { TEST_PATIENT_2_AGENT_ITEMS } from '@/constants/analysisDemoDataTest2';
import { TEST_PATIENT_3_AGENT_ITEMS } from '@/constants/analysisDemoDataTest3';

export interface AnalysisResultItem {
  key: string;
  label: string;
  score: number;
  /** خلاصهٔ کوتاه برای نمایش در داشبورد */
  briefSummary?: string;
  /** دادهٔ داخلی دمو — در UI نمایش داده نمی‌شود */
  evidence?: string[];
  coreBelief?: string;
  clinicalAnalysis?: string;
  summary?: string;
}

export function getDisplaySummary(item: AnalysisResultItem): string {
  return (
    item.briefSummary ??
    item.summary ??
    item.clinicalAnalysis ??
    'خلاصهٔ این مورد در پرونده ثبت شده است.'
  );
}

const SCHEMA_ITEMS: AnalysisResultItem[] = [
  {
    key: 'defectiveness_shame',
    label: 'نقص / شرم',
    score: 85,
    evidence: [
      'نکنه واقعا آدمیم که هیچ تعهد اخلاقی نداره ؟',
      'چه مشکلی دارم من ؟',
      'چرا نمیخواد احساس کنم دوست داشتنی و ارزشمندم ؟',
      'چرا اشتباهشو قبول نمیکنه که من آدم بدی نیستم ؟',
    ],
    briefSummary:
      'شک به ارزشمندی خود و نگرانی از اینکه دیگران او را قضاوت می‌کنند یا دوست ندارند.',
    coreBelief: 'من آدم بد، بی‌تعهد و بی‌ارزشی هستم.',
  },
  {
    key: 'emotional_deprivation',
    label: 'محرومیت هیجانی',
    score: 82,
    evidence: [
      'چرا نمیخواد احساس کنم دوست داشتنی و ارزشمندم ؟',
      'میدونم هرگز امنیت نداشتم توی این رابطه',
      'دوست دارم باشه ولی عمیقا دلم نمیخواد باشه',
    ],
    briefSummary:
      'احساس می‌کند کسی او را واقعاً درک نمی‌کند و نیاز عاطفی‌اش برآورده نمی‌شود.',
    coreBelief: 'نیازهای عاطفی‌ام هرگز به‌درستی برآورده نمی‌شود.',
  },
  {
    key: 'enmeshment',
    label: 'درهم‌تنیدگی / خود تحول‌نیافته',
    score: 80,
    evidence: [
      'دلم میخواد آزاد تر زندگی کنم و رها باشم',
      'حس خفگی دارم',
      'این از همین الان نفسم و میگیره',
      'حس میکنم با همدیگهایم و باید بهش متعهد باشم',
      'دوباره برگشتم ۱۸ سالگی',
    ],
    briefSummary:
      'در رابطه احساس خفگی و گیر افتادن می‌کند؛ همزمان می‌خواهد آزاد باشد و به تعهدات پایبند بماند.',
    coreBelief: 'من نمی‌توانم بدون از دست دادن هویت خود، آزاد و جدا از دیگری زندگی کنم. خفه می‌شوم.',
  },
  {
    key: 'mistrust_abuse',
    label: 'بدبینی / سوءاستفاده',
    score: 75,
    evidence: [
      'تو دنبال یه نکته برای تحقیر و توهین من میگردی',
      'چرا انقدر دروغ میگه ؟',
      'میدونم میخواد احساس گناه بهم بده',
      'بهم دیشب گفت خیلی مهمه اشتباه نریم ! ... خیلی مهمه کسی دستش به تن و بدنت نخوره',
    ],
    briefSummary:
      'به دیگران با بدبینی نگاه می‌کند؛ رفتار آن‌ها را تحقیر، فریب یا کنترل تفسیر می‌کند.',
    coreBelief: 'دیگران عمداً مرا تحقیر، فریب و کنترل می‌کنند و به من آسیب می‌زنند.',
  },
];

const ATTACHMENT_ITEMS: AnalysisResultItem[] = [
  {
    key: 'anxious_preoccupied',
    label: 'اضطرابی / دوسوگرا',
    score: 4,
    briefSummary: 'نگرانی مداوم از دوست‌داشتنی نبودن و نیاز به اطمینان در رابطه.',
    evidence: [
      'چرا نمیخواد احساس کنم دوست داشتنی و ارزشمندم؟',
      'میدونم هرگز امنیت نداشتم توی این رابطه',
      'دوباره آشفتم، ناامنم',
      'چرا انقدر امید دارم ۲ سال دیگه یا ۵ سال دیگه تغییر کرده باشه؟',
    ],
  },
  {
    key: 'avoidant_dismissive',
    label: 'اجتنابی / طردکننده',
    score: 3,
    briefSummary: 'تمایل به فاصله و قطع تماس، در حالی که هنوز به رابطه وابسته است.',
    evidence: [
      'نمیخوام ببینمت، نمیخوام برگردم توی اون چرخه تکراری',
      'بهم زنگ نزن، پیام نده',
      'دلم میخواد آزاد تر زندگی کنم و رها باشم',
      'حس خفگی دارم',
    ],
  },
  {
    key: 'disorganized',
    label: 'آشفته (ترسناک-اجتنابی)',
    score: 4,
    briefSummary: 'همزمان خواستن و نخواستن رابطه؛ سردرگمی و نوسان شدید در نزدیکی و دوری.',
    evidence: [
      'مگه میشه آدم همزمان دو تا چیز رو بخواد؟ اونم انقدر متضاد؟',
      'دوست دارم باشه ولی عمیقا دلم نمیخواد باشه',
      'همش چرخه اس انگار، قهر و دعوا بعد خوشحالی عمیق',
      'نمیدونم کار درست چیه، خیلی گیجم، خیلی آشفتم',
    ],
  },
];

const CLINICAL_DISORDER_ITEMS: AnalysisResultItem[] = [
  {
    key: 'major_depression',
    label: 'اختلال افسردگی اساسی',
    score: 80,
    briefSummary: 'خلق پایین، کم‌انگیزی و کناره‌گیری از کارهای روزمره در گفتگوها مشهود است.',
    evidence: [
      '۱ هفته اس حموم نرفتم به جز اون روزی که قرار بود برم خونشون',
      'حال روحیم بد میشه',
      'کاری نمیکنم',
      'دوباره آشفتم',
      'حس خفگی دارم',
    ],
  },
  {
    key: 'generalized_anxiety',
    label: 'اختلال اضطراب فراگیر',
    score: 75,
    briefSummary: 'نگرانی مداوم، فکرهای تکراری و دشواری در تصمیم‌گیری روزمره.',
    evidence: [
      'این چراها همش توی سرمه',
      'توی دوگانگیم',
      'همه ی خواسته ها درونم دو وجهین',
      'خیلی گیجم',
      'اعصابم خورد میشه ببینمشون',
    ],
  },
];

const COGNITIVE_DISTORTION_ITEMS: AnalysisResultItem[] = [
  {
    key: 'mind_reading',
    label: 'ذهن‌خوانی',
    score: 7,
    evidence: [
      'تو دلت میخواد منو ببینی صدامو بشنوی',
      'میدونم میخواد احساس گناه بهم بده بعدا که پیاماش و جواب ندادم',
    ],
    briefSummary: 'فکر می‌کند بدون شواهد می‌داند دیگران چه فکری دارند یا چه نیتایی دارند.',
  },
  {
    key: 'negative_future',
    label: 'پیش‌بینی منفی آینده',
    score: 6,
    evidence: [
      'چرا انقدر امید دارم ۲ سال دیگه تغییر کرده باشه؟ اونکه امروز نشون داد هموز دنبال تحقیر کردن منه؟',
      'انگار میدونم دوباره با همین آدمی که تغییر نکرده برمیگردم',
    ],
    briefSummary: 'انتظار دارد آینده هم مثل گذشته منفی و آسیب‌زا باشد.',
  },
  {
    key: 'personalization',
    label: 'شخصی‌سازی',
    score: 6,
    evidence: [
      'چرا من باید با بوی گردن اون یاد یه نفر دیگه بیوفتم چه مشکلی دارم من ؟',
      'نکنه واقعا آدمیم که هیچ تعهد اخلاقی نداره ؟',
    ],
    summary: 'خود را مسئول دانستن برای رویدادهای خنثی.',
    clinicalAnalysis: 'نسبت دادن بیش‌ازحد مسئولیت به خود.',
  },
  {
    key: 'all_or_nothing',
    label: 'تفکر همه یا هیچ',
    score: 5,
    evidence: [
      'نمیخوام بهش متعهد باشم و نمیخوام تعهد رو خراب کنم',
      'مگه میشه آدم همزمان دو تا چیز رو بخواد ؟ اونم انقدر متضاد ؟',
    ],
    summary: 'دوگانگی و تفکر سیاه‌وسفید در خواسته‌های متناقض.',
    clinicalAnalysis: 'الگوی تفکر قطعی در ارزیابی گزینه‌ها.',
  },
  {
    key: 'labeling',
    label: 'برچسب‌زنی',
    score: 4,
    evidence: ['نکنه واقعا آدمیم که هیچ تعهد اخلاقی نداره ؟'],
    summary: 'برچسب منفی به کل شخصیت بر اساس یک رویداد.',
    clinicalAnalysis: 'تعمیم یک رفتار به هویت کلی.',
  },
];

const PERSONAL_TRAIT_ITEMS: AnalysisResultItem[] = [
  {
    key: 'neuroticism',
    label: 'روان‌رنجوری (NEO)',
    score: 9.5,
    evidence: [
      'احساس گناه و عذاب وجدان شدیدی داشتم و دارم',
      'اعصابم خورد میشه ببینمشون',
      'آشفتم / نا امنم / حس خفگی دارم',
    ],
    summary: 'قطب: بالا — اطمینان مدل: ۹۵٪',
    clinicalAnalysis:
      'گزارش مکرر گناه، آشفتگی، ناامنی و خفگی عاطفی نشان‌دهنده روان‌رنجوری بالا است.',
  },
  {
    key: 'conscientiousness',
    label: 'وجدان‌کاری (NEO)',
    score: 8,
    evidence: ['۱ هفته اس حموم نرفتم', 'کاری نمیکنم', 'خونه ام اجمالی تمیز کردم'],
    summary: 'قطب: پایین — اطمینان مدل: ۸۰٪',
    clinicalAnalysis: 'غفلت از بهداشت و انضباط روزانه؛ وظیفه‌شناسی پایین.',
  },
  {
    key: 'openness',
    label: 'تجربه‌گری (NEO)',
    score: 7.5,
    evidence: [
      'دلم میخواد آزاد تر زندگی کنم و رها باشم',
      'انسانها عاشق طرف میشن یا لحظاتشون ؟',
      'کتاب / نوشتن / فکر',
    ],
    summary: 'قطب: بالا — اطمینان مدل: ۷۵٪',
    clinicalAnalysis: 'کنجکاوی فلسفی و پذیرش تضادهای درونی.',
  },
];

const RELATIONAL_PATTERN_ITEMS: AnalysisResultItem[] = [
  {
    key: 'recurrent_conflict',
    label: 'الگوی تعارض تکرارشونده',
    score: 8,
    evidence: ['رفتارای تکراری قهر و دعوا بعد خوشحالی عمیق', 'من بر میگردم اول چرخه'],
    summary: 'قهر و دعوا و سپس خوشحالی عمیق، بازگشت به چرخه',
    clinicalAnalysis: 'چرخه تکرارشونده تعارض-آشتی در رابطه.',
  },
  {
    key: 'push_pull',
    label: 'چرخه طرد-جذب',
    score: 7,
    evidence: ['هر بار میبینمت من بر میگردم اول چرخه', 'نمیخوام ببینمت ولی امید دارم ۲ سال دیگه تغییر کرده باشه'],
    summary: 'رفتار متناوب طرد و جذب',
    clinicalAnalysis: 'نوسان بین نزدیکی و فاصله در رابطه.',
  },
  {
    key: 'controlling',
    label: 'رفتار کنترل‌گرانه',
    score: 7,
    evidence: ['خیلی مهمه کسی دستش به تن و بدنت نخوره', 'دنبال تحقیر و توهین من میگردی'],
    summary: 'کنترل و تحقیر در تعامل',
    clinicalAnalysis: 'تعارض حول مرزهای جسمی و کنترل هیجانی.',
  },
  {
    key: 'unhealthy_dependence',
    label: 'وابستگی ناسالم',
    score: 6,
    evidence: ['دوست دارم باشه ولی عمیقا دلم نمیخواد باشه', 'میدونم دوباره با همین آدمی برمیگردم'],
    summary: 'نیاز عاطفی در عین آگاهی از آسیب',
    clinicalAnalysis: 'وابستگی همراه با مقاومت در برابر قطع رابطه.',
  },
];

const FUNCTIONAL_LEVEL_ITEMS: AnalysisResultItem[] = [
  {
    key: 'social',
    label: 'عملکرد اجتماعی',
    score: 7,
    evidence: [
      'وقتی بابام هست چند دقیقه نمیتونم تحملش کنم و همش تو اتاقم با در قفلم',
      'بهش گفتم هربار میبینمت ... بر میگردم اول چرخه',
      'حس خفگی دارم',
    ],
    summary: 'تعاملات سمی و انزوای شدید',
    clinicalAnalysis: 'افت عملکرد اجتماعی و اجتناب از موقعیت‌های خانوادگی و رابطه‌ای.',
  },
  {
    key: 'concentration',
    label: 'مشکل تمرکز / توجه',
    score: 6,
    evidence: ['این چراها همش توی سرمه', 'خیلی گیجم', 'همه ی خواسته ها درونم دووجهین'],
    summary: 'افکار مزاحم و دوگانگی',
    clinicalAnalysis: 'اختلال در تمرکز و تصمیم‌گیری روزمره.',
  },
];

const RISK_ITEMS: AnalysisResultItem[] = [
  {
    key: 'self_harm',
    label: 'آسیب به خود',
    score: 4,
    evidence: ['گاهی فکر می‌کنم هیچ‌چیز جلو نمی‌رود'],
    clinicalAnalysis: 'شاخص پایین-متوسط؛ پایش در جلسات بعد توصیه می‌شود.',
  },
  {
    key: 'suicidal_thoughts',
    label: 'افکار خودکشی',
    score: 2,
    evidence: [],
    clinicalAnalysis: 'در متن فعلی شاهد مستقیم گزارش نشده؛ غربالگری ادامه یابد.',
  },
  {
    key: 'functional_breakdown',
    label: 'فروپاشی شدید عملکرد',
    score: 6,
    evidence: ['کاری نمیکنم', '۱ هفته حموم نرفتم'],
    clinicalAnalysis: 'اختلال در کارهای روزمره و مراقبت از خود.',
  },
];

const MOOD_ITEM: AnalysisResultItem = {
  key: 'mood',
  label: 'خلق',
  score: 6,
  briefSummary:
    'در جلسات اخیر مراجع این احساس‌ها را تجربه کرده است: اضطراب و ناامنی، غم و بدحالی، خشم و تحریک‌پذیری، گناه و عذاب وجدان، احساس خفگی و گیر افتادن، و گاه شادی گذرا پس از آشتی.',
  evidence: [
    '«دوباره آشفتم، ناامنم»',
    '«حال روحیم بد میشه»',
    '«اعصابم خورد میشه ببینمشون»',
    '«احساس گناه و عذاب وجدان شدیدی داشتم و دارم»',
    '«حس خفگی دارم»',
    '«همش چرخه‌اس انگار، قهر و دعوا بعد خوشحالی عمیق»',
  ],
};

const TEST_PATIENT_1_AGENT_ITEMS: Record<AnalysisAgentId, AnalysisResultItem[]> = {
  emotional_state: [MOOD_ITEM],
  schema: SCHEMA_ITEMS,
  attachment: ATTACHMENT_ITEMS,
  clinical_disorder: CLINICAL_DISORDER_ITEMS,
  cognitive_distortion: COGNITIVE_DISTORTION_ITEMS,
  personal_train: PERSONAL_TRAIT_ITEMS,
  relational_pattern: RELATIONAL_PATTERN_ITEMS,
  functional_level: FUNCTIONAL_LEVEL_ITEMS,
  risk_indicators: RISK_ITEMS,
};

const PATIENT_AGENT_ITEMS: Record<string, Record<AnalysisAgentId, AnalysisResultItem[]>> = {
  'test-patient-1': TEST_PATIENT_1_AGENT_ITEMS,
  'test-patient-2': TEST_PATIENT_2_AGENT_ITEMS,
  'test-patient-3': TEST_PATIENT_3_AGENT_ITEMS,
};

const DEFAULT_TEST_PATIENT_ID = 'test-patient-1';

function resolvePatientAgentItems(
  patientId?: string,
): Record<AnalysisAgentId, AnalysisResultItem[]> {
  if (patientId && PATIENT_AGENT_ITEMS[patientId]) {
    return PATIENT_AGENT_ITEMS[patientId];
  }
  return PATIENT_AGENT_ITEMS[DEFAULT_TEST_PATIENT_ID];
}

export function getAnalysisItemsForAgent(
  agentId: AnalysisAgentId,
  patientId?: string,
): AnalysisResultItem[] {
  const items = [...(resolvePatientAgentItems(patientId)[agentId] ?? [])];
  return items.sort((a, b) => b.score - a.score);
}

/** تعداد آیتم‌های خروجی یک agent برای مراجع (۰ = router اجرا نکرده یا نتیجه‌ای نداشت) */
export function getAgentOutputCount(
  agentId: AnalysisAgentId,
  patientId?: string,
): number {
  return getAnalysisItemsForAgent(agentId, patientId).length;
}

export function getTopAnalysisItem(
  agentId: AnalysisAgentId,
  patientId?: string,
): AnalysisResultItem | null {
  const items = getAnalysisItemsForAgent(agentId, patientId);
  return items[0] ?? null;
}

export function getAnalysisItemByKey(
  agentId: AnalysisAgentId,
  key: string,
  patientId?: string,
): AnalysisResultItem | undefined {
  return resolvePatientAgentItems(patientId)[agentId]?.find((i) => i.key === key);
}
