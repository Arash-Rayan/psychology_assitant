import { PatientDetail } from './PatientDetailView';
import { SCHEMA_TYPES, SchemaType } from './SchemaTypes';
import { doctors } from '@/utils/mockClinicData';

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

const intakeConversationSummaries = [
  'مراجع در چند پیام اول از خواب نامنظم، تپش قلب هنگام ورود به محیط کار و احساس «غرق شدن در فکر» صحبت کرد. تمایل به اجتناب از تماس‌های کاری را بیان کرد و هم‌زمان نگران قضاوت همکاران بود. در پاسخ به سوالات باز، اشاره کرد که از دو هفته پیش شدت علائم بیشتر شده و برای آرام شدن گاهی تا دیروقت در شبکه‌های اجتماعی می‌ماند.',
  'گفت‌وگو حول تعارض با یکی از اعضای خانواده، احساس طرد شدن و ترس از قطع رابطه چرخید. مراجع چند بار تأکید کرد که «نمی‌داند انتخاب درست چیست» و هم احساس دلتنگی و هم نیاز به فاصله را هم‌زمان توصیف کرد. در بخش پایانی تمایل به مراجعه حضوری برای شروع فرایند درمان را اعلام کرد.',
  'تمرکز اصلی بر اضطراب اجتماعی محدود به موقعیت‌های ارائه و صحبت در جمع بود. مراجع تکنیک تنفس را امتحان کرده اما می‌گفت در لحظه واقعی فراموش می‌کند. از سردردهای عصرگاهی و گرفتگی شانه‌ها هم نام برد. برای بار اول با پلتفرم آشنا بود و پاسخ‌ها کوتاه اما هم‌راستا با غربالگری بود.',
];

const intakeHighlightPools: string[][] = [
  [
    'علائم جسمی همراه با استرس (تپش، سفتی عضلانی) گزارش شد.',
    'الگوی اجتناب از موقعیت‌های عملکردی محور کار بیان شد.',
    'آستانه تحمل در هفتهٔ اخیر کاهش یافته است.',
  ],
  [
    'تعارض بین‌فردی خانوادگی محور گفت‌وگو بود.',
    'دوگانگی احساسی (دلتنگی در کنار نیاز به فاصله) مشخص بود.',
    'مراجع آمادگی برای ادامهٔ مسیر درمانی را نشان داد.',
  ],
  [
    'ترس از ارزیابی منفی دیگران در موقعیت‌های اجتماعی برجسته بود.',
    'استفاده نامنظم از مهارت‌های تنظیم هیجان ذکر شد.',
    'پیگیری خواب و فعالیت روزانه پیشنهاد شد؛ مراجع موافقت اولیه کرد.',
  ],
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
      id: 'test-patient-1',
      name: 'مراجع تست',
      age: 29,
      gender: 'زن',
      phone: '۰۹۱۲ ۳۴۵ ۶۷۸۹',
      clinicalEngagement: 'established',
      assignedDoctorId: doctors[0]?.id ?? 'd1',
      status: 'attention',
      overallScore: 58,
      sessionsCount: 6,
      lastSession: 'امروز',
      schemas: [
        {
          name: 'رهاشدگی/بی‌ثباتی',
          severity: 'medium',
          frequency: 9,
          lastDetected: 'دیروز',
          description: 'ترس از ترک شدن یا از دست دادن رابطه ایمن در موقعیت های هیجانی.'
        },
        {
          name: 'محرومیت هیجانی',
          severity: 'medium',
          frequency: 7,
          lastDetected: 'هفته گذشته',
          description: 'احساس نادیده گرفته شدن نیازهای عاطفی و دریافت ناکافی حمایت هیجانی.'
        }
      ],
      behaviors: [
        {
          pattern: 'نشخوار فکری بعد از تعارض بین فردی',
          occurrences: 11,
          trend: 'increasing'
        },
        {
          pattern: 'نوشتن احساسات پیش از خواب',
          occurrences: 8,
          trend: 'stable'
        }
      ],
      monthlyMood: [
        { date: 'هفته ۱', mood: 52, anxiety: 63, depression: 49 },
        { date: 'هفته ۲', mood: 54, anxiety: 60, depression: 47 },
        { date: 'هفته ۳', mood: 57, anxiety: 58, depression: 45 },
        { date: 'هفته ۴', mood: 59, anxiety: 55, depression: 43 }
      ],
      aiInsights: [
        'الگوی نگرانی بین فردی همچنان فعال است و نیاز به مداخله ساختاریافته دارد.',
        'توانایی خودتنظیمی اولیه وجود دارد اما هنوز ناپایدار است.'
      ],
      chatbotSummary: {
        mainTopic: 'روابط',
        confidence: 82,
        notes: 'در مکالمات اخیر تمرکز اصلی بر تعارض‌های رابطه‌ای، نیاز به مرزبندی و بهبود گفت‌وگوی زوجی بوده است.'
      },
      assessments: {
        neo: {
          neuroticism: 67,
          extraversion: 41,
          openness: 58,
          agreeableness: 72,
          conscientiousness: 54
        },
        depression: 48,
        anxiety: 61,
        stress: 55
      }
    },
    {
      id: 'test-patient-2',
      name: 'مراجع تست ۲',
      age: 27,
      gender: 'زن',
      phone: '۰۹۱۳ ۴۵۶ ۷۸۹۰',
      clinicalEngagement: 'established',
      assignedDoctorId: doctors[0]?.id ?? 'd1',
      status: 'attention',
      overallScore: 52,
      sessionsCount: 4,
      lastSession: 'دیروز',
      schemas: [
        {
          name: 'جلب توجه / تأییدخواهی',
          severity: 'high',
          frequency: 12,
          lastDetected: 'دیروز',
          description: 'خودارزشی وابسته به تأیید شریک؛ رفتار و ظاهر بر اساس خواسته او تنظیم می‌شود.'
        },
        {
          name: 'اطاعت',
          severity: 'high',
          frequency: 10,
          lastDetected: 'دیروز',
          description: 'مقدم دانستن خواسته‌های دیگران بر نیازهای خود، حتی با آگاهی از هزینه شخصی.'
        },
        {
          name: 'نقص / شرم',
          severity: 'medium',
          frequency: 9,
          lastDetected: 'هفته گذشته',
          description: 'احساس شرم از بدن و درآمد ناکافی در مقایسه با معیارهای شریک.'
        }
      ],
      behaviors: [
        {
          pattern: 'تأییدخواهی و خرج کردن برای جلب رضایت شریک',
          occurrences: 14,
          trend: 'increasing'
        },
        {
          pattern: 'نشخوار فکری درباره پارتنر قبلی',
          occurrences: 10,
          trend: 'stable'
        }
      ],
      monthlyMood: [
        { date: 'هفته ۱', mood: 48, anxiety: 68, depression: 55 },
        { date: 'هفته ۲', mood: 50, anxiety: 65, depression: 52 },
        { date: 'هفته ۳', mood: 51, anxiety: 63, depression: 50 },
        { date: 'هفته ۴', mood: 52, anxiety: 62, depression: 49 }
      ],
      aiInsights: [
        'دلبستگی اضطرابی با وابستگی ناسالم به شریک فعلی و حسرت رابطه قبلی هم‌پوشانی دارد.',
        'تحریف‌های شناختی (ذهن‌خوانی، پیش‌بینی منفی) چرخه تأییدخواهی را تقویت می‌کنند.'
      ],
      chatbotSummary: {
        mainTopic: 'روابط',
        confidence: 88,
        notes: 'پس از خیانت و پایان رابطه قبلی، ورود به رابطه موقت جدید با الگوی تأییدخواهی، خرج مالی افراطی و نشخوار فکری درباره پارتنر سابق.'
      },
      assessments: {
        neo: {
          neuroticism: 95,
          extraversion: 45,
          openness: 50,
          agreeableness: 75,
          conscientiousness: 35
        },
        depression: 52,
        anxiety: 72,
        stress: 64
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
      ? 'خلاصهٔ اولیه از گفت‌وگوی غربالگری: مراجع تازه‌وار؛ تمرکز روی علائم و زمینهٔ مراجعه. پروندهٔ درمانی کامل هنوز تشکیل نشده — فقط دادهٔ ارزیابی ورودی موجود است.'
      : 'تحلیل چت‌بات نشان می‌دهد الگوی غالب در گفت‌وگوها نیاز به مداخله هدفمند در همین حوزه است.';

    const intakeConversationSummary = isNewIntake
      ? intakeConversationSummaries[
          (firstName.charCodeAt(0) + lastName.charCodeAt(0) + i) %
            intakeConversationSummaries.length
        ]
      : undefined;
    const intakeChatHighlights = isNewIntake
      ? intakeHighlightPools[
          (lastName.charCodeAt(0) + i * 7) % intakeHighlightPools.length
        ]
      : undefined;

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
        mainTopic: rng.element(chatbotTopics),
        confidence: isNewIntake ? rng.int(55, 78) : rng.int(62, 95),
        notes: intakeNotes,
      },
      ...(isNewIntake
        ? { intakeConversationSummary, intakeChatHighlights }
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

  return patients;
}
