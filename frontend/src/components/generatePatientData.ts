import { PatientDetail } from './PatientDetailView';
import { SCHEMA_TYPES, SchemaType } from './SchemaTypes';
import { doctors } from '@/utils/mockClinicData';
import { buildDemoPreConsultPatient } from '@/constants/demoPreConsultPatient';
import {
  DEMO_PRE_CONSULT_PATIENT_ID,
  PRE_CONSULT_SAMPLE_CHAT,
  PRE_CONSULT_SAMPLE_HIGHLIGHTS,
  PRE_CONSULT_SAMPLE_SUBJECT,
  PRE_CONSULT_SAMPLE_SUMMARY,
} from '@/constants/demoPreConsultCouplesChat';

/** ثابت برای دادهٔ شبیه‌سازی؛ هر بار بارگذاری صفحه همان مراجع با همان id تولید می‌شوند و لینک تقویم ↔ لیست مراجعین هم‌خوان می‌ماند. */
export const DEMO_THERAPIST_DATA_SEED = 0x706d6832; // 'pmh2'

const persianFirstNames = [
  'علی', 'محمد', 'رضا', 'حسین', 'سارا', 'فاطمه', 'زهرا', 'مریم', 'نازنین', 'پریسا',
  'حمید', 'مهدی', 'امیر', 'سعید', 'احمد', 'مینا', 'لیلا', 'شیدا', 'نرگس', 'آرزو',
  'کیانا', 'سمیرا', 'الهام', 'نیلوفر', 'پروین', 'کامران', 'بهرام', 'داریوش', 'فرهاد', 'سهیل',
  'مژگان', 'شهلا', 'طاهره', 'معصومه', 'رویا', 'ثریا', 'فریبا', 'سیما', 'منیژه', 'گلناز',
  'مسعود', 'جواد', 'عباس', 'اکبر', 'اصغر', 'فرید', 'مجید', 'نادر', 'ناصر', 'هادی'
];

const persianLastNames = [
  'محمدی', 'احمدی', 'کریمی', 'حسینی', 'رضایی', 'امیری', 'نوری', 'صادقی', 'یوسفی', 'قاسمی',
  'موسوی', 'خلیلی', 'اسماعیلی', 'عباسی', 'جعفری', 'نجفی', 'رحمانی', 'زارعی', 'علیزاده', 'حسن‌زاده',
  'اکبری', 'فیروزی', 'شریفی', 'باقری', 'محمودی', 'طاهری', 'سلیمانی', 'کاظمی', 'رستمی', 'هاشمی',
  'ملکی', 'فتحی', 'کمالی', 'صفری', 'فروزان', 'پارسا', 'دهقان', 'رنجبر', 'قربانی', 'میرزایی',
  'عزیزی', 'نظری', 'رضوی', 'افشار', 'سلطانی', 'جلالی', 'فخاری', 'بهرامی', 'صبوری', 'منصوری'
];

const genders = ['مرد', 'زن'];

const behaviorPatterns = [
  'اجتناب از تعاملات اجتماعی در مواقع استرس',
  'الگوی خواب نامنظم در آخر هفته‌ها',
  'افزایش فعالیت بدنی به عنوان مکانیزم مقابله‌ای',
  'واکنش‌های دفاعی در برابر بازخورد',
  'دشواری در پذیرش مسئولیت اشتباهات',
  'ژورنال‌نویسی منظم احساسات',
  'شرکت در فعالیت‌های گروهی',
  'استفاده منظم از تکنیک‌های ذهن‌آگاهی',
  'برنامه‌ریزی منظم برای فعالیت‌های لذت‌بخش',
  'انزوای اجتماعی در دوره‌های افسردگی',
  'پرخوری در شب‌ها',
  'اهمال‌کاری در کارهای مهم',
  'بررسی مکرر شبکه‌های اجتماعی',
  'مقایسه مداوم با دیگران',
  'خودانتقادی شدید پس از اشتباهات',
  'جستجوی تایید مداوم از دیگران',
  'کمال‌گرایی افراطی در کار',
  'نگرانی مفرط در مورد آینده',
  'فعالیت‌های ورزشی منظم',
  'تمرین‌های تنفسی در مواقع اضطراب'
];

const aiInsightTemplates = [
  'پیشرفت قابل توجه در مدیریت اضطراب',
  'الگوی مثبت در استفاده از تکنیک‌های مقابله‌ای سالم',
  'توصیه می‌شود بر روی تقویت روابط اجتماعی تمرکز شود',
  'نیاز به توجه بیشتر به الگوهای خواب',
  'پیشرفت عالی در رسیدن به اهداف درمانی',
  'نشانه‌هایی از بهبود در کاهش افکار منفی',
  'ریسک بالا برای عود - نیاز به پیگیری مداوم',
  'افزایش نگران‌کننده در سطح افسردگی',
  'پاسخ خوب به درمان شناختی-رفتاری',
  'نیاز به ارزیابی مجدد رویکرد درمانی',
  'آمادگی برای کاهش تعداد جلسات',
  'توانایی بالا در استفاده مستقل از تکنیک‌های یادگرفته شده',
  'مقاومت در برابر تغییر - نیاز به بازبینی انگیزش',
  'بهبود قابل ملاحظه در خودکارآمدی',
  'نشانه‌های اولیه بهبود در تنظیم هیجانی'
];

const chatbotTopics: Array<'ازدواج' | 'روابط' | 'فردی' | 'اضطراب' | 'خانواده'> = [
  'ازدواج',
  'روابط',
  'فردی',
  'اضطراب',
  'خانواده'
];

const timeReferences = [
  'امروز', 'دیروز', 'پریروز', 'هفته گذشته', '۲ هفته پیش', '۳ هفته پیش',
  '۱ روز پیش', '۲ روز پیش', '۳ روز پیش', '۴ روز پیش', '۵ روز پیش',
  '۶ روز پیش', '۷ روز پیش', '۱۰ روز پیش', '۱۵ روز پیش'
];

/** PRNG قطعی برای مراجع شبیه‌سازی‌شده (هر بار خروجی یکسان برای همان seed). */
interface SeededRng {
  next: () => number;
  int: (min: number, max: number) => number;
  element: <T>(arr: readonly T[]) => T;
}

function createSeededRng(seed: number): SeededRng {
  let state = seed >>> 0;
  const next = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return {
    next,
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    element: <T>(arr: readonly T[]) => arr[Math.floor(next() * arr.length)],
  };
}

function generatePhoneNumber(rng: SeededRng): string {
  const prefixes = ['۰۹۱۲', '۰۹۱۳', '۰۹۱۴', '۰۹۱۵', '۰۹۱۶', '۰۹۱۷', '۰۹۱۸', '۰۹۱۹'];
  const prefix = rng.element(prefixes);
  const part1 = rng.int(100, 999).toString().split('').map(d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]).join('');
  const part2 = rng.int(1000, 9999).toString().split('').map(d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]).join('');
  return `${prefix} ${part1} ${part2}`;
}

function generateMoodData(rng: SeededRng) {
  const baseScore = rng.int(30, 85);
  const trend = rng.next() > 0.5 ? 1 : -1;

  return [
    {
      date: 'هفته ۱',
      mood: baseScore,
      anxiety: rng.int(20, 70),
      depression: rng.int(15, 65)
    },
    {
      date: 'هفته ۲',
      mood: Math.min(100, Math.max(0, baseScore + trend * rng.int(0, 8))),
      anxiety: rng.int(20, 70),
      depression: rng.int(15, 65)
    },
    {
      date: 'هفته ۳',
      mood: Math.min(100, Math.max(0, baseScore + trend * rng.int(5, 15))),
      anxiety: rng.int(20, 70),
      depression: rng.int(15, 65)
    },
    {
      date: 'هفته ۴',
      mood: Math.min(100, Math.max(0, baseScore + trend * rng.int(10, 20))),
      anxiety: rng.int(20, 70),
      depression: rng.int(15, 65)
    }
  ];
}

export function generatePatients(
  count: number = 100,
  seed: number = DEMO_THERAPIST_DATA_SEED,
): PatientDetail[] {
  const rng = createSeededRng(seed);
  const patients: PatientDetail[] = [
    {
      id: 'test-patient-2',
      name: 'مراجع خانم (مشکلات خانوادگی)',
      age: 31,
      gender: 'زن',
      phone: '۰۹۱۳ ۴۵۶ ۷۸۹۰',
      clinicalEngagement: 'established',
      assignedDoctorId: doctors[0]?.id ?? 'd1',
      status: 'attention',
      overallScore: 48,
      sessionsCount: 4,
      lastSession: 'دیروز',
      schemas: [
        {
          name: 'محرومیت هیجانی',
          severity: 'high',
          frequency: 12,
          lastDetected: 'دیروز',
          description: 'عدم دریافت توجه و اولویت عاطفی؛ کاهش توجه پس از تولد فرزند.'
        },
        {
          name: 'منفی‌نگری/بدبینی',
          severity: 'high',
          frequency: 11,
          lastDetected: 'دیروز',
          description: 'از دست دادن امید؛ باور به عدم امکان بهبود تا تغییر شرایط بیرونی.'
        },
        {
          name: 'معیارهای سرسختانه',
          severity: 'high',
          frequency: 11,
          lastDetected: 'دیروز',
          description: 'انتظار مطلق از همسر برای اولویت‌بخشی و قطع ارتباط با خواهر.'
        },
        {
          name: 'بی‌اعتمادی/بدرفتاری',
          severity: 'high',
          frequency: 10,
          lastDetected: 'دیروز',
          description: 'خشونت فیزیکی، شکست اعتماد و احساس فریب‌خوردن.'
        },
      ],
      behaviors: [
        {
          pattern: 'تعارض با شوهر (دعوا، قهر و سکوت)',
          occurrences: 12,
          trend: 'increasing'
        },
        {
          pattern: 'نشخوار فکری درباره خواهر شوهر و تماس‌های او',
          occurrences: 9,
          trend: 'stable'
        }
      ],
      monthlyMood: [
        { date: 'هفته ۱', mood: 42, anxiety: 70, depression: 62 },
        { date: 'هفته ۲', mood: 40, anxiety: 72, depression: 65 },
        { date: 'هفته ۳', mood: 38, anxiety: 74, depression: 68 },
        { date: 'هفته ۴', mood: 38, anxiety: 75, depression: 70 }
      ],
      aiInsights: [
        'دلبستگی اضطرابی-آشفته با دخالت خانواده همسر و خشونت فیزیکی هم‌پوشانی دارد.',
        'افسردگی و ناامیدی پس از تولد فرزند؛ باور که ناراحتی تنها راه وادار کردن همسر به تلاش است.'
      ],
      chatbotSummary: {
        mainTopic: 'ازدواج و خانواده',
        confidence: 90,
        notes: '۷ سال ازدواج، فرزند یک‌ساله؛ نارضایتی از دخالت خانواده شوهر، افسردگی پس از تولد بچه، خشونت فیزیکی همسر و الگوی تعارض مکرر.'
      },
      assessments: {
        neo: {
          neuroticism: 95,
          extraversion: 35,
          openness: 48,
          agreeableness: 38,
          conscientiousness: 52
        },
        depression: 70,
        anxiety: 68,
        stress: 72
      }
    },
    {
      id: 'test-patient-ar',
      name: 'مراجع AR',
      age: 29,
      gender: 'مرد',
      phone: '۰۹۱۲ ۷۸۹ ۰۱۲۳',
      clinicalEngagement: 'established',
      assignedDoctorId: doctors[0]?.id ?? 'd1',
      status: 'attention',
      overallScore: 52,
      sessionsCount: 2,
      lastSession: 'امروز',
      schemas: [
        {
          name: 'نقص/شرم',
          severity: 'high',
          frequency: 11,
          lastDetected: 'امروز',
          description:
            'تجربه ترک به‌خاطر پول و احساس بی‌ارزشی؛ باور به اینکه بدون امنیت مالی لایق رابطه نیست.',
        },
        {
          name: 'معیارهای سرسختانه',
          severity: 'high',
          frequency: 12,
          lastDetected: 'امروز',
          description:
            'قانون شخصی سخت‌گیرانه: تا امنیت شغلی و قابل‌برنامه‌ریزی بودن ۵ سال آینده، حق فکر کردن به رابطه ندارد.',
        },
        {
          name: 'محرومیت هیجانی',
          severity: 'medium',
          frequency: 8,
          lastDetected: 'امروز',
          description:
            'به تعویق انداختن تفریح، رابطه و رسیدگی به «کودک درون» به نفع موفقیت و امنیت مالی.',
        },
        {
          name: 'بی‌اعتمادی/بدرفتاری',
          severity: 'medium',
          frequency: 9,
          lastDetected: 'امروز',
          description:
            'باور جهان‌شمول که حتی اگر طرف بگوید پول مهم نیست، ته دل نگران امنیت خانواده است؛ ترس از ترک دوباره به‌خاطر ضعف.',
        },
      ],
      behaviors: [
        {
          pattern: 'کار سخت و مشغولیت مداوم برای امنیت مالی',
          occurrences: 14,
          trend: 'increasing',
        },
        {
          pattern: 'به تعویق انداختن رابطه و تفریح تا رسیدن به استاندارد امنیتی',
          occurrences: 10,
          trend: 'stable',
        },
      ],
      monthlyMood: [
        { date: 'هفته ۱', mood: 50, anxiety: 62, depression: 48 },
        { date: 'هفته ۲', mood: 48, anxiety: 64, depression: 50 },
        { date: 'هفته ۳', mood: 46, anxiety: 66, depression: 52 },
        { date: 'هفته ۴', mood: 47, anxiety: 65, depression: 51 },
      ],
      aiInsights: [
        'تضاد بین نیاز به رابطه و قانون «اول امنیت مالی»؛ تجربه ترک به‌خاطر پول و انتظار طولانی‌مدت پارتنر قبلی.',
        'استاندارد ۵ ساله و ترس از ترک به‌خاطر ضعف به‌عنوان زره محافظتی در برابر صمیمیت.',
      ],
      chatbotSummary: {
        mainTopic: 'روابط',
        confidence: 88,
        notes:
          'بازخورد دوست درباره کار سخت و نادیده گرفتن تفریح/رابطه؛ تجربه ترک به‌خاطر پول؛ قانون شخصی امنیت شغلی قبل از رابطه؛ ترس از ترک دوباره به‌خاطر ضعف.',
      },
      assessments: {
        neo: {
          neuroticism: 72,
          extraversion: 42,
          openness: 55,
          agreeableness: 48,
          conscientiousness: 78,
        },
        depression: 52,
        anxiety: 64,
        stress: 68,
      },
    },
    {
      id: 'test-patient-3',
      name: 'مراجع E J',
      age: 28,
      gender: 'زن',
      phone: '۰۹۱۴ ۵۶۷ ۸۹۰۱',
      clinicalEngagement: 'established',
      assignedDoctorId: doctors[0]?.id ?? 'd1',
      status: 'attention',
      overallScore: 50,
      sessionsCount: 3,
      lastSession: 'امروز',
      schemas: [
        {
          name: 'تأییدجویی/شناخت‌طلبی',
          severity: 'high',
          frequency: 13,
          lastDetected: 'امروز',
          description:
            'ارزش من به تأیید دیگران وابسته است و باید خودم را مطابق خواسته‌های آنها تغییر دهم تا پذیرفته شوم.'
        },
        {
          name: 'تسلیم',
          severity: 'high',
          frequency: 12,
          lastDetected: 'امروز',
          description:
            'نیازها و خواسته‌های من در مقایسه با خواسته‌های دیگران بی‌اهمیت هستند و من باید خودم را تسلیم کنم تا طرد نشوم.'
        },
        {
          name: 'نقص/شرم',
          severity: 'high',
          frequency: 11,
          lastDetected: 'امروز',
          description:
            'من ذاتاً نقص دارم و به دلیل کمبودهایم (بدن، درآمد، ارزش) لایق عشق و پذیرش نیستم.'
        }
      ],
      behaviors: [
        {
          pattern: 'مراجع دائماً به رابطه قبلی خود با حدیث فکر می‌کند و خاطرات را مرور می‌کند.',
          occurrences: 12,
          trend: 'increasing'
        },
        {
          pattern: 'مراجع به دلیل خرج کردن پول برای پارتنر جدید به خود فحش می‌دهد اما باز هم این کار را تکرار می‌کند.',
          occurrences: 11,
          trend: 'stable'
        }
      ],
      monthlyMood: [
        { date: 'هفته ۱', mood: 46, anxiety: 70, depression: 58 },
        { date: 'هفته ۲', mood: 47, anxiety: 69, depression: 56 },
        { date: 'هفته ۳', mood: 49, anxiety: 67, depression: 54 },
        { date: 'هفته ۴', mood: 50, anxiety: 66, depression: 53 }
      ],
      aiInsights: [
        'تمام پولم رو براش تقریبا خرج می‌کنم',
        'به خودم فوش می‌دم که چرا این پول رو دادی، ولی بازم میرم انجامش می‌دم',
        'احساس می‌کنم فرد رابطه قبلیم حدیث رو دوستش دارم، حتی نمی‌دونم چیشو دوست دارم',
        'همش به این فکر می‌کنم که گند زدم و از دستش دادم',
      ],
      chatbotSummary: {
        mainTopic: 'روابط',
        confidence: 90,
        notes:
          'مراجع با حسرت از دست دادن رابطه قبلی خود به دلیل خیانتش صحبت می‌کند و با وجود آگاهی از نقص‌های طرف مقابل، روزانه خاطرات او را مرور می‌کند. هم‌زمان وارد رابطه جدیدی شده که خودش آن را موقتی می‌داند، اما تمام وقت و پول خود را برای جلب تأیید پارتنر جدید صرف می‌کند و از پیشرفت شخصی خود غافل می‌شود.'
      },
      assessments: {
        neo: {
          neuroticism: 85,
          extraversion: 42,
          openness: 48,
          agreeableness: 72,
          conscientiousness: 30
        },
        depression: 54,
        anxiety: 74,
        stress: 66
      }
    }
  ];
  const schemaKeys = Object.keys(SCHEMA_TYPES) as SchemaType[];

  const schemaAssignmentCount = new Map<SchemaType, number>();
  schemaKeys.forEach(key => schemaAssignmentCount.set(key, 0));

  for (let i = 0; i < count; i++) {
    const firstName = rng.element(persianFirstNames);
    const lastName = rng.element(persianLastNames);
    const age = rng.int(18, 65);
    const gender = rng.element(genders);
    const isNewIntake = rng.next() < 0.28;
    const clinicalEngagement = isNewIntake ? 'new_intake' : 'established';
    const sessionsCount = isNewIntake ? 0 : rng.int(1, 30);
    const assignedDoctorId = doctors[i % doctors.length]?.id ?? doctors[0]?.id ?? 'd1';

    const statusRand = rng.next();
    let status: 'safe' | 'attention' | 'urgent';
    let overallScore: number;

    if (statusRand < 0.15) {
      status = 'urgent';
      overallScore = rng.int(20, 45);
    } else if (statusRand < 0.40) {
      status = 'attention';
      overallScore = rng.int(45, 65);
    } else {
      status = 'safe';
      overallScore = rng.int(65, 95);
    }

    const numSchemas = isNewIntake ? rng.int(0, 1) : rng.int(1, 4);
    const patientSchemas = [];
    const usedSchemas = new Set<string>();

    for (let j = 0; j < numSchemas; j++) {
      let schemaKey: SchemaType;

      if (i < schemaKeys.length && j === 0) {
        schemaKey = schemaKeys[i];
      } else {
        const sortedByCount = [...schemaKeys].sort((a, b) =>
          (schemaAssignmentCount.get(a) || 0) - (schemaAssignmentCount.get(b) || 0)
        );

        if (rng.next() < 0.7) {
          const leastRepresented = sortedByCount.slice(0, Math.ceil(schemaKeys.length / 2));
          do {
            schemaKey = rng.element(leastRepresented);
          } while (usedSchemas.has(schemaKey));
        } else {
          do {
            schemaKey = rng.element(schemaKeys);
          } while (usedSchemas.has(schemaKey));
        }
      }

      usedSchemas.add(schemaKey);
      schemaAssignmentCount.set(schemaKey, (schemaAssignmentCount.get(schemaKey) || 0) + 1);

      const severities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      const severity = status === 'urgent'
        ? rng.element(['medium', 'high'] as Array<'medium' | 'high'>)
        : status === 'attention'
        ? rng.element(severities)
        : rng.element(['low', 'medium'] as Array<'low' | 'medium'>);

      patientSchemas.push({
        name: schemaKey,
        severity,
        frequency: rng.int(1, 25),
        lastDetected: rng.element(timeReferences),
        description: SCHEMA_TYPES[schemaKey].description
      });
    }

    const numBehaviors = isNewIntake ? rng.int(0, 2) : rng.int(2, 4);
    const patientBehaviors = [];
    const usedBehaviors = new Set<string>();

    for (let j = 0; j < numBehaviors; j++) {
      let behavior: string;
      do {
        behavior = rng.element(behaviorPatterns);
      } while (usedBehaviors.has(behavior));

      usedBehaviors.add(behavior);

      const trends: Array<'increasing' | 'decreasing' | 'stable'> = ['increasing', 'decreasing', 'stable'];
      patientBehaviors.push({
        pattern: behavior,
        occurrences: rng.int(1, 30),
        trend: rng.element(trends)
      });
    }

    const numInsights = isNewIntake ? rng.int(1, 2) : rng.int(2, 4);
    const patientInsights = [];
    const usedInsights = new Set<string>();

    for (let j = 0; j < numInsights; j++) {
      let insight: string;
      do {
        insight = rng.element(aiInsightTemplates);
      } while (usedInsights.has(insight));

      usedInsights.add(insight);
      patientInsights.push(insight);
    }

    const intakeNotes = isNewIntake
      ? 'پیش‌مشاورهٔ زوجین تکمیل شده؛ خلاصه و گفت‌وگوی نمونه در پروندهٔ ورودی موجود است.'
      : 'تحلیل چت‌بات نشان می‌دهد الگوی غالب در گفت‌وگوها نیاز به مداخله هدفمند در همین حوزه است.';

    patients.push({
      id: String(i + 1),
      name: `${firstName} ${lastName}`,
      age,
      gender,
      phone: generatePhoneNumber(rng),
      clinicalEngagement,
      assignedDoctorId,
      status,
      overallScore,
      sessionsCount,
      lastSession: isNewIntake ? '—' : rng.element(timeReferences),
      schemas: patientSchemas,
      behaviors: patientBehaviors,
      monthlyMood: isNewIntake
        ? [
            {
              date: 'ورود',
              mood: overallScore,
              anxiety: rng.int(25, 70),
              depression: rng.int(20, 65),
            },
          ]
        : generateMoodData(rng),
      aiInsights: patientInsights,
      chatbotSummary: {
        mainTopic: isNewIntake ? 'روابط' : rng.element(chatbotTopics),
        confidence: isNewIntake ? rng.int(55, 78) : rng.int(62, 95),
        notes: intakeNotes,
      },
      ...(isNewIntake
        ? {
            intakeConversationSummary: PRE_CONSULT_SAMPLE_SUMMARY,
            intakeChatHighlights: PRE_CONSULT_SAMPLE_HIGHLIGHTS,
            intakeChatMessages: PRE_CONSULT_SAMPLE_CHAT,
            preConsultSubject: PRE_CONSULT_SAMPLE_SUBJECT,
          }
        : {}),
      assessments: {
        neo: {
          neuroticism: rng.int(25, 80),
          extraversion: rng.int(25, 80),
          openness: rng.int(25, 80),
          agreeableness: rng.int(25, 80),
          conscientiousness: rng.int(25, 80)
        },
        depression: rng.int(20, 75),
        anxiety: rng.int(20, 75),
        stress: rng.int(20, 75)
      }
    });
  }

  const withoutDemo = patients.filter((p) => p.id !== DEMO_PRE_CONSULT_PATIENT_ID);
  return [buildDemoPreConsultPatient(), ...withoutDemo];
}
