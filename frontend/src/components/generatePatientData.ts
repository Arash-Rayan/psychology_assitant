import { PatientDetail } from './PatientDetailView';
import { SCHEMA_TYPES, SchemaType } from './SchemaTypes';

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

const timeReferences = [
  'امروز', 'دیروز', 'پریروز', 'هفته گذشته', '۲ هفته پیش', '۳ هفته پیش',
  '۱ روز پیش', '۲ روز پیش', '۳ روز پیش', '۴ روز پیش', '۵ روز پیش',
  '۶ روز پیش', '۷ روز پیش', '۱۰ روز پیش', '۱۵ روز پیش'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhoneNumber(): string {
  const prefixes = ['۰۹۱۲', '۰۹۱۳', '۰۹۱۴', '۰۹۱۵', '۰۹۱۶', '۰۹۱۷', '۰۹۱۸', '۰۹۱۹'];
  const prefix = getRandomElement(prefixes);
  const part1 = getRandomInt(100, 999).toString().split('').map(d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]).join('');
  const part2 = getRandomInt(1000, 9999).toString().split('').map(d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]).join('');
  return `${prefix} ${part1} ${part2}`;
}

function generateMoodData() {
  const baseScore = getRandomInt(30, 85);
  const trend = Math.random() > 0.5 ? 1 : -1;
  
  return [
    {
      date: 'هفته ۱',
      mood: baseScore,
      anxiety: getRandomInt(20, 70),
      depression: getRandomInt(15, 65)
    },
    {
      date: 'هفته ۲',
      mood: Math.min(100, Math.max(0, baseScore + trend * getRandomInt(0, 8))),
      anxiety: getRandomInt(20, 70),
      depression: getRandomInt(15, 65)
    },
    {
      date: 'هفته ۳',
      mood: Math.min(100, Math.max(0, baseScore + trend * getRandomInt(5, 15))),
      anxiety: getRandomInt(20, 70),
      depression: getRandomInt(15, 65)
    },
    {
      date: 'هفته ۴',
      mood: Math.min(100, Math.max(0, baseScore + trend * getRandomInt(10, 20))),
      anxiety: getRandomInt(20, 70),
      depression: getRandomInt(15, 65)
    }
  ];
}

export function generatePatients(count: number = 100): PatientDetail[] {
  const patients: PatientDetail[] = [];
  const schemaKeys = Object.keys(SCHEMA_TYPES) as SchemaType[];
  
  // Track how many patients have been assigned to each schema to ensure all are represented
  const schemaAssignmentCount = new Map<SchemaType, number>();
  schemaKeys.forEach(key => schemaAssignmentCount.set(key, 0));

  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(persianFirstNames);
    const lastName = getRandomElement(persianLastNames);
    const age = getRandomInt(18, 65);
    const gender = getRandomElement(genders);
    const sessionsCount = getRandomInt(1, 30);
    
    // Determine status based on probability
    const statusRand = Math.random();
    let status: 'safe' | 'attention' | 'urgent';
    let overallScore: number;
    
    if (statusRand < 0.15) { // 15% urgent
      status = 'urgent';
      overallScore = getRandomInt(20, 45);
    } else if (statusRand < 0.40) { // 25% attention
      status = 'attention';
      overallScore = getRandomInt(45, 65);
    } else { // 60% safe
      status = 'safe';
      overallScore = getRandomInt(65, 95);
    }

    // Generate 1-4 schemas for this patient
    const numSchemas = getRandomInt(1, 4);
    const patientSchemas = [];
    const usedSchemas = new Set<string>();
    
    for (let j = 0; j < numSchemas; j++) {
      let schemaKey: SchemaType;
      
      // For the first 18 patients, ensure each schema gets assigned at least once
      if (i < schemaKeys.length && j === 0) {
        schemaKey = schemaKeys[i];
      } else {
        // Otherwise, pick randomly (with slight preference for underrepresented schemas)
        const sortedByCount = [...schemaKeys].sort((a, b) => 
          (schemaAssignmentCount.get(a) || 0) - (schemaAssignmentCount.get(b) || 0)
        );
        
        // 70% chance to pick from least represented half, 30% completely random
        if (Math.random() < 0.7) {
          const leastRepresented = sortedByCount.slice(0, Math.ceil(schemaKeys.length / 2));
          do {
            schemaKey = getRandomElement(leastRepresented);
          } while (usedSchemas.has(schemaKey));
        } else {
          do {
            schemaKey = getRandomElement(schemaKeys);
          } while (usedSchemas.has(schemaKey));
        }
      }
      
      usedSchemas.add(schemaKey);
      schemaAssignmentCount.set(schemaKey, (schemaAssignmentCount.get(schemaKey) || 0) + 1);
      
      const severities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      const severity = status === 'urgent' 
        ? getRandomElement(['medium', 'high'] as Array<'medium' | 'high'>)
        : status === 'attention'
        ? getRandomElement(severities)
        : getRandomElement(['low', 'medium'] as Array<'low' | 'medium'>);
      
      patientSchemas.push({
        name: schemaKey,
        severity,
        frequency: getRandomInt(1, 25),
        lastDetected: getRandomElement(timeReferences),
        description: SCHEMA_TYPES[schemaKey].description
      });
    }

    // Generate 2-4 behavior patterns
    const numBehaviors = getRandomInt(2, 4);
    const patientBehaviors = [];
    const usedBehaviors = new Set<string>();
    
    for (let j = 0; j < numBehaviors; j++) {
      let behavior: string;
      do {
        behavior = getRandomElement(behaviorPatterns);
      } while (usedBehaviors.has(behavior));
      
      usedBehaviors.add(behavior);
      
      const trends: Array<'increasing' | 'decreasing' | 'stable'> = ['increasing', 'decreasing', 'stable'];
      patientBehaviors.push({
        pattern: behavior,
        occurrences: getRandomInt(1, 30),
        trend: getRandomElement(trends)
      });
    }

    // Generate 2-4 AI insights
    const numInsights = getRandomInt(2, 4);
    const patientInsights = [];
    const usedInsights = new Set<string>();
    
    for (let j = 0; j < numInsights; j++) {
      let insight: string;
      do {
        insight = getRandomElement(aiInsightTemplates);
      } while (usedInsights.has(insight));
      
      usedInsights.add(insight);
      patientInsights.push(insight);
    }

    patients.push({
      id: (i + 1).toString(),
      name: `${firstName} ${lastName}`,
      age,
      gender,
      phone: generatePhoneNumber(),
      status,
      overallScore,
      sessionsCount,
      lastSession: getRandomElement(timeReferences),
      schemas: patientSchemas,
      behaviors: patientBehaviors,
      monthlyMood: generateMoodData(),
      aiInsights: patientInsights
    });
  }

  return patients;
}
