import type { AnalysisAgentId } from '@/constants/analysisAgents';
import type { AnalysisResultItem } from '@/constants/analysisDemoData';

/** خروجی graph.invoke — مراجع تست ۳ — هم‌راستا با content_output/context_output3.json */

const SCHEMA_ITEMS: AnalysisResultItem[] = [
  {
    key: 'approval_seeking',
    label: 'جلب توجه / تأییدخواهی',
    score: 95,
    evidence: [
      'بازم دارم جوی زندگی می کنم که به خودم آسیب می زنم ، اینجوریه که دارم ازون تایید میگیرم',
      'دوست دارم یجوری لباس بپوشم که اون خوشش بیاد',
      'دائم در حال تایید گرفتن هستم ازش',
    ],
    coreBelief: 'برای احساس ارزشمندی باید دائماً از دیگران تأیید بگیرم و رضایت آنها را جلب کنم.',
    clinicalAnalysis:
      'فرد به طور وسواسی به دنبال تأیید پارتنر فعلی است و رفتارهای خود را برای جلب رضایت او تنظیم می‌کند، حتی به قیمت آسیب به خود.',
  },
  {
    key: 'subjugation',
    label: 'اطاعت',
    score: 90,
    evidence: [
      'تمام پولم رو براش تقریبا خرج می کنم',
      'وقتی که می توونم صرف ساز زدن و پیشرفت بکنم دارم با اون می گذرونم',
      'دوست دارم یجوری لباس بپوشم که اون خوشش بیاد',
    ],
    coreBelief: 'نیازها و خواسته‌های دیگران مهم‌تر از نیازهای من است و باید تسلیم خواسته‌های آنان شوم.',
    clinicalAnalysis:
      'فرد نیازهای خود (مانند پیشرفت و خرید کفش) را نادیده می‌گیرد و مطابق خواسته‌های پارتنر رفتار می‌کند، حتی اگر منطقی نباشد.',
  },
  {
    key: 'defectiveness_shame',
    label: 'نقص / شرم',
    score: 90,
    evidence: [
      'نسبت به اینکه بدن وزشکاری ندارم حس مضخرفی دارم',
      'نسبت به اینکه درامد زیادی ندارم حس مضخرفی دارم',
      'ممکه ملیکا بیشتر اون خوشش بیاد',
    ],
    coreBelief: 'من معیوب، ناقص و بی‌ارزش هستم و دیگران این نقص را می‌بینند.',
    clinicalAnalysis:
      'فرد نسبت به ظاهر و درآمد خود احساس حقارت و شرم دارد و خود را در مقایسه با دیگران ناکافی می‌بیند. این احساس نقص و شرم باعث می‌شود برای جبران، به دنبال تأیید شدید از طرف مقابل باشد.',
  },
  {
    key: 'insufficient_self_control',
    label: 'کنترل ضعیف / خودانضباطی',
    score: 85,
    evidence: [
      'بازم دارم جوی زندگی می کنم که به خودم آسیب می زنم',
      'بعضی وقتا وقتی دائم دارم این پولو براش خرج می کنم به خودم فوش می دم که چرا این پول رو دادی ... ولی بازم میرم انجامش میدم',
    ],
    coreBelief: 'نمی‌توانم در برابر وسوسه‌ها و خواسته‌های لحظه‌ای مقاومت کنم، حتی اگر به خودم آسیب بزنم.',
    clinicalAnalysis:
      'فرد علی رغم آگاهی از پیامدهای منفی (خرج کردن بی‌رویه برای رابطه موقت)، قادر به کنترل رفتار خود نیست و به صورت تکانشی عمل می‌کند.',
  },
  {
    key: 'punitiveness',
    label: 'تنبیه‌گرایی',
    score: 80,
    evidence: [
      'به خودم فوش می دم که چرا این پول رو دادی',
      'به این فکر می کنم که گند زدم و از دستش دادم',
    ],
    coreBelief: 'من سزاوار تنبیه و سرزنش برای اشتباهاتم هستم و باید خود را مجازات کنم.',
    clinicalAnalysis:
      'فرد پس از رفتارهای مخرب، خود را سرزنش می‌کند و در رابطه قبلی نیز خود را مسئول شکست می‌داند، که نشان‌دهنده تمایل به تنبیه خود است.',
  },
];

const ATTACHMENT_ITEMS: AnalysisResultItem[] = [
  {
    key: 'anxious_preoccupied',
    label: 'اضطرابی / دوسوگرا',
    score: 8,
    evidence: [
      'دائماً از شریک فعلی تأیید می‌گیرم',
      'خودم را با دیگران مقایسه می‌کنم',
      'به خاطرات رابطه قبلی فکر می‌کنم',
      'نسبت به بدن و درآمدم احساس شرم دارم چون شریکم ممکن است دوست نداشته باشد',
    ],
    clinicalAnalysis:
      'فرد به شدت نیازمند تأیید و توجه از سوی شریک است، خود را با دیگران مقایسه می‌کند، و ترس از طرد شدن دارد. الگوی ذهنی او حول محور جلب رضایت دیگری می‌چرخد و از دست دادن رابطه قبلی را با حسرت و سرزنش خود همراه می‌کند.',
  },
  {
    key: 'disorganized',
    label: 'آشفته (ترسناک-اجتنابی)',
    score: 8,
    evidence: [
      'با اینکه می‌دانم رابطه موقته، خودم را آسیب می‌زنم و پولم را خرج می‌کنم',
      'به خودم فحش می‌دهم ولی باز هم همان کار را تکرار می‌کنم',
      'نسبت به شریک قبلی احساس دلبستگی دارم و نمی‌دانم چرا',
      'رفتارهای متناقض: عاشق قبلی هستم ولی با فعلی هستم',
    ],
    clinicalAnalysis:
      'فرد رفتارهای متناقض و خودتخریب‌گرانه دارد، با وجود آگاهی از آسیب‌زا بودن رابطه، آن را ادامه می‌دهد. احساس سردرگمی عاطفی و تکرار الگوهای ناکارآمد از ویژگی‌های دلبستگی آشفته است.',
  },
  {
    key: 'dismissive_avoidant',
    label: 'اجتنابی / طردکننده',
    score: 2,
    evidence: ['می‌دانم که این رابطه موقته'],
    clinicalAnalysis:
      'آگاهی از موقتی بودن رابطه نشانه‌ای از فاصله‌گیری شناختی است، اما فرد همچنان به شدت درگیر رابطه است و رفتارهای وابسته نشان می‌دهد. بنابراین اجتناب فعالانه وجود ندارد.',
  },
];

const COGNITIVE_DISTORTION_ITEMS: AnalysisResultItem[] = [
  {
    key: 'negative_future',
    label: 'پیش‌بینی منفی آینده',
    score: 7,
    evidence: ['تقریبا مطمئنم این رابطه موقته', 'می دونم که یروز نزدیکی مسیرش جدا میشه'],
    briefSummary: 'پیش‌بینی منفی از آینده رابطه',
  },
  {
    key: 'mind_reading',
    label: 'ذهن‌خوانی',
    score: 6,
    evidence: [
      'چون اون خوشش نمیاد که من پول تداشته باشم',
      'ممکه ملیکا بیشتر اون خوشش بیاد',
    ],
    briefSummary: 'ذهن‌خوانی در مورد نظرات و ترجیحات دیگران',
  },
  {
    key: 'personalization',
    label: 'شخصی‌سازی',
    score: 5,
    evidence: [
      'به این فکر می کنم که گند زدم و از دستش دادم',
      'به خودم فوش می دم که چرا این پول رو دادی',
    ],
    briefSummary: 'سرزنش خود برای اتفاقاتی که خارج از کنترل بوده',
  },
];

const PERSONAL_TRAIT_ITEMS: AnalysisResultItem[] = [
  {
    key: 'neuroticism',
    label: 'روان‌رنجوری (NEO)',
    score: 9,
    evidence: [
      'حسرت بزرگی از اون رابطه تو دلم هست',
      'بازم دارم جوی زندگی می کنم که به خودم آسیب می زنم',
      'دائم در حال تایید گرفتن هستم ازش',
      'خیلی وقتا خودم دارم با کسایی مقایسه می کنم',
      'بدترین حسی که اخیرا دارم تجربه می کنم',
      'دائم دارم خاطرات پارتنر قبلیم رو مرور می کنم',
    ],
    summary: 'قطب: بالا — اطمینان مدل: ۹۰٪',
    clinicalAnalysis:
      'The user shows high neuroticism through persistent rumination on past relationship, emotional distress, self-destructive behavior, constant need for validation, frequent social comparison, and negative affect. Facets such as anxiety, depression, self-consciousness, and vulnerability are prominent.',
  },
  {
    key: 'conscientiousness',
    label: 'وجدان‌کاری (NEO)',
    score: 8.5,
    evidence: [
      'تمام پولم رو براش تقریبا خرج می کنم',
      'وقتی که می توونم صرف ساز زدن و پیشرفت بکنم دارم با اون می گذرونم',
      'به خودم فوش می دم که چرا این پولو دادی',
    ],
    summary: 'قطب: پایین — اطمینان مدل: ۸۵٪',
    clinicalAnalysis:
      'The user exhibits low conscientiousness by impulsively spending money on a temporary relationship instead of personal growth, lacking self-discipline, and engaging in behavior they regret. Facets of self-discipline and deliberation are notably low.',
  },
];

const RELATIONAL_PATTERN_ITEMS: AnalysisResultItem[] = [
  {
    key: 'unhealthy_dependence',
    label: 'وابستگی ناسالم',
    score: 8,
    evidence: [
      'تمام پولم رو براش تقریبا خرج می کنم',
      'دوست دارم یجوری لباس بپوشم که اون خوشش بیاد',
      'دائم در حال تایید گرفتن هستم ازش',
      'نسبت به اینکه بدن وزشکاری ندارم حس مضخرفی دارم چون اوون ورزشگار خوشش میاد',
      'نسبت به اینکه درامد زیادی ندارم حس مضخرفی دارم چون اون خوشش نمیاد که من پول تداشته باشم',
    ],
    briefSummary:
      'وابستگی شدید به تایید و رضایت طرف مقابل، صرف تمام پول و تطبیق ظاهر و رفتار با خواسته‌های او',
  },
  {
    key: 'pathological_jealousy',
    label: 'حسادت مرضی',
    score: 6,
    evidence: [
      'ممکه ملیکا بیشتر اون خوشش بیاد',
      'ممکنه اون فرد مورد علاقه تر باشه برا اون',
      'مقایسه با پارتنر فعلی',
    ],
    briefSummary:
      'ترس از اینکه طرف مقابل فرد دیگری را بیشتر دوست داشته باشد و مقایسه مداوم خود با دیگران',
  },
  {
    key: 'push_pull',
    label: 'چرخه طرد-جذب',
    score: 4,
    evidence: [
      'واسه یه رابطه ای که می دونم موقته ... بازم دارم جوی زندگی می کنم که به خودم آسیب می زنم',
      'دائم دارم خاطرات پارتنر قبلیم رو مرور می کنم',
    ],
    briefSummary: 'چسبیدن به رابطه‌ای موقت و همزمان درگیر خاطرات رابطه قبلی بودن',
  },
];

const FUNCTIONAL_LEVEL_ITEMS: AnalysisResultItem[] = [
  {
    key: 'social',
    label: 'عملکرد اجتماعی',
    score: 5,
    evidence: [
      'دائم در حال تایید گرفتن از شریک فعلی است',
      'خود را با دیگران مقایسه می‌کند',
    ],
    briefSummary:
      'اختلال در عملکرد اجتماعی به دلیل نیاز مداوم به تأیید از شریک و مقایسه خود با دیگران',
  },
  {
    key: 'concentration',
    label: 'مشکل تمرکز / توجه',
    score: 6,
    evidence: [
      'دائم خاطرات پارتنر قبلی را مرور می‌کند',
      'تقریبا هر روز به فرد قبلی فکر می‌کند',
    ],
    briefSummary: 'مشکل در تمرکز و توجه به دلیل نشخوار فکری مداوم درباره رابطه قبلی',
  },
];

export const TEST_PATIENT_3_AGENT_ITEMS: Record<AnalysisAgentId, AnalysisResultItem[]> = {
  emotional_state: [],
  schema: SCHEMA_ITEMS,
  attachment: ATTACHMENT_ITEMS,
  clinical_disorder: [],
  cognitive_distortion: COGNITIVE_DISTORTION_ITEMS,
  personal_train: PERSONAL_TRAIT_ITEMS,
  relational_pattern: RELATIONAL_PATTERN_ITEMS,
  functional_level: FUNCTIONAL_LEVEL_ITEMS,
  risk_indicators: [],
};
