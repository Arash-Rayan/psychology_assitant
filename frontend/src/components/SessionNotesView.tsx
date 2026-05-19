import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, FileText, Calendar, User, ArrowRight, Plus, Edit, Trash2, Brain, Sparkles } from 'lucide-react';
import { Patient } from './PatientCard';
import { AddSessionNoteDialog } from './AddSessionNoteDialog';
import { SessionNotesAiSummaryDialog } from './SessionNotesAiSummaryDialog';
import { cn } from '@/components/ui/utils';

interface SessionNote {
  id: string;
  date: string;
  dateMs: number;
  sessionNumber: number;
  duration: string;
  mood: string;
  mainTopics: string[];
  chiefComplaint: string;
  historyBackground: string;
  sessionObjective: string;
  summary: string;
  formulation: string;
  treatmentPlan: string;
  homework: string;
  nextSessionGoals: string;
}

function stableNoteCount(patientId: string): number {
  let hash = 0;
  for (let i = 0; i < patientId.length; i++) {
    hash = (hash << 5) - hash + patientId.charCodeAt(i);
    hash |= 0;
  }
  return 3 + (Math.abs(hash) % 5);
}

function buildSessionNotes(patientId: string): SessionNote[] {
  const noteCount = stableNoteCount(patientId);
  return Array.from({ length: noteCount }, (_, i) => {
    const dateMs = Date.now() - (noteCount - i - 1) * 7 * 24 * 60 * 60 * 1000;
    return {
      id: `${patientId}-note-${i}`,
      date: new Date(dateMs).toLocaleDateString('fa-IR'),
      dateMs,
      sessionNumber: i + 1,
      duration: '۴۵ دقیقه',
      mood: ['آرام', 'مضطرب', 'غمگین', 'امیدوار', 'خوشحال'][i % 5],
      mainTopics: [
        'بررسی احساسات هفته گذشته',
        'تمرین‌های ذهن‌آگاهی',
        'چالش‌های محیط کار',
        'روابط خانوادگی',
        'مدیریت استرس',
      ].slice(0, 2 + (i % 2)),
      chiefComplaint: 'مراجع به دلیل اضطراب مداوم در محیط کار و اختلال در خواب مراجعه کرده است.',
      historyBackground: 'علائم از حدود شش ماه پیش تشدید شده؛ سابقه خانوادگی اضطراب ذکر شده است.',
      sessionObjective: 'کاهش شدت اضطراب هنگام ارائه در جلسات کاری و آموزش تکنیک‌های تنظیم هیجان.',
      summary:
        'مراجع در این جلسه پیشرفت خوبی در مدیریت احساسات خود نشان داد. مشکلات مربوط به محیط کار به تفصیل بررسی شد و راهکارهای عملی ارائه گردید.',
      formulation:
        'الگوی اجتناب از موقعیت‌های ارائه، با باورهای ناکارآمد درباره قضاوت دیگران تقویت می‌شود.',
      treatmentPlan: 'ادامه درمان شناختی–رفتاری با تمرین مواجهه تدریجی و بازسازی باورها.',
      homework: 'انجام تمرینات تنفسی روزانه، ثبت احساسات در دفترچه یادداشت، تمرین گفتگوی مثبت با خود',
      nextSessionGoals:
        'بررسی پیشرفت در تمرینات خانگی، کار روی طرحواره‌های شناختی، تمرکز بر روابط بین‌فردی',
    };
  });
}

interface SchemaAnalysisItem {
  نمره: number;
  شواهد: string[];
  /** باور خودکار‌شناسی طرحواره (جدا از تحلیل بالینی در UI) */
  باور_بنیادین: string;
  تحلیل_بالینی: string;
}

/** خروجی تحلیل طرحواره برای مراجع تست (هم‌راستا با `frontend/test_output.json`) */
const schemaAnalysisData: Record<string, SchemaAnalysisItem> = {
  'نقص/شرم': {
    نمره: 85,
    شواهد: [
      'نکنه واقعا آدمیم که هیچ تعهد اخلاقی نداره ؟',
      'چه مشکلی دارم من ؟',
      'چرا نمیخواد احساس کنم دوست داشتنی و ارزشمندم ؟',
      'چرا اشتباهشو قبول نمیکنه که من آدم بدی نیستم ؟'
    ],
    باور_بنیادین: 'من آدم بد، بی‌تعهد و بی‌ارزشی هستم.',
    تحلیل_بالینی:
      'مراجع در مواجهه با احساس گناه عادی، دچار تردید بنیادین در مورد «خوب بودن» خود می‌شود و تصور می‌کند شاید ذاتاً فردی بی‌اخلاق است. این خودشکاوی شدید و ترس از طرد شدن به دلیل «بدی درونی»، نشانه بارز طرحواره نقص/شرم است.'
  },
  'درهم‌تنیدگی/خود تحول‌نیافته': {
    نمره: 80,
    شواهد: [
      'دلم میخواد آزاد تر زندگی کنم و رها باشم',
      'حس خفگی دارم',
      'این از همین الان نفسم و میگیره',
      'حس میکنم با همدیگهایم و باید بهش متعهد باشم',
      'دوباره برگشتم ۱۸ سالگی'
    ],
    باور_بنیادین:
      'من نمی‌توانم بدون از دست دادن هویت خود، آزاد و جدا از دیگری زندگی کنم. خفه می‌شوم.',
    تحلیل_بالینی:
      'مراجع حس می‌کند در رابطه گرفتار شده و هرگونه تعهد یا وابستگی، نفسش را می‌بَرَد. آرزوی رهایی و آزادی دارد اما همزمان خود را در چرخه تکرار می‌بیند و به سنین نوجوانی پسرفت می‌کند که نشانه درهم‌تنیدگی و فقدان خود تفکیک‌یافته است.'
  },
  'بدبینی/سوءاستفاده': {
    نمره: 75,
    شواهد: [
      'تو دنبال یه نکته برای تحقیر و توهین من میگردی',
      'چرا انقدر دروغ میگه ؟',
      'میدونم میخواد احساس گناه بهم بده',
      'بهم دیشب گفت خیلی مهمه اشتباه نریم ! ... خیلی مهمه کسی دستش به تن و بدنت نخوره',
      'اون پریشب داشت با همکارش جلوی من لاس میزد'
    ],
    باور_بنیادین: 'دیگران عمداً مرا تحقیر، فریب و کنترل می‌کنند و به من آسیب می‌زنند.',
    تحلیل_بالینی:
      'مراجع رفتارهای طرف مقابل را عمداً تحقیرآمیز، دروغین و کنترل‌گرانه تعبیر می‌کند. حرف‌هایی مانند «نکند اشتباه برویم» و لاس زدن جلوی او، همراه با احساس گناه‌دهی عمدی، الگوی سوءاستفاده روانی و بی‌اعتمادی پایدار را نشان می‌دهد.'
  }
};

const attachmentAnalysisData = {
  ایمن: {
    نمره: 0,
    شواهد: [] as string[],
    تحلیل_بالینی:
      'هیچ نشانه معناداری از الگوی دلبستگی ایمن در متن مشاهده نمی‌شود. فرد دچار ناامنی شدید هیجانی، بی‌ثباتی در رابطه و فقدان احساس امنیت پایدار در رابطه دلبستگی است.'
  },
  'اضطرابی / دوسوگرا': {
    نمره: 4,
    شواهد: [
      'چرا نمیخواد احساس کنم دوست داشتنی و ارزشمندم؟',
      'میدونم هرگز امنیت نداشتم توی این رابطه',
      'دوباره آشفتم، ناامنم',
      'حس میکنم دوباره برگشتم ۱۸ سالگی، دوباره باید به اون اثبات کنم',
      'دوست دارم باشه ولی عمیقا دلم نمیخواد باشه',
      'من بر میگردم اول چرخه',
      'چرا انقدر امید دارم ۲ سال دیگه یا ۵ سال دیگه تغییر کرده باشه؟'
    ],
    تحلیل_بالینی:
      'الگوی اضطرابی-مشغول با فعال‌سازی شدید سیستم دلبستگی دیده می‌شود. فرد دچار نیاز به تأیید، نگرانی درباره دوست‌داشتنی بودن، و ترس از ناامنی در رابطه است. نشخوار فکری درباره تغییر احتمالی طرف مقابل و تکرار چرخه‌های رابطه‌ای نشان‌دهنده درگیری ذهنی مداوم با رابطه است. همزمان احساس ناامنی و عدم کفایت شخصی در رابطه برجسته است.'
  },
  'اجتنابی / طردکننده': {
    نمره: 3,
    شواهد: [
      'نمیخوام ببینمت، نمیخوام برگردم توی اون چرخه تکراری',
      'بهم زنگ نزن، پیام نده',
      'دلم میخواد آزاد تر زندگی کنم و رها باشم',
      'این از همین الان نفسم و میگیره',
      'ثبات میخوام، آزادی میخوام',
      'حس خفگی دارم'
    ],
    تحلیل_بالینی:
      'الگوی اجتنابی به صورت فعال‌سازی مکانیزم فاصله‌گیری دیده می‌شود. فرد تمایل به قطع تماس، حفظ استقلال و فرار از احساس خفگی در رابطه دارد. این رفتارها نشان‌دهنده تلاش برای کاهش فشار هیجانی ناشی از صمیمیت هستند، اما این اجتناب در کنار وابستگی عاطفی عمل می‌کند و پایدار نیست.'
  },
  'آشفته (ترسناک-اجتنابی)': {
    نمره: 4,
    شواهد: [
      'مگه میشه آدم همزمان دو تا چیز رو بخواد؟ اونم انقدر متضاد؟',
      'دوست دارم باشه ولی عمیقا دلم نمیخواد باشه',
      'همش چرخه اس انگار، رفتارای تکراری، قهر و دعوا بعد خوشحالی عمیق، خوشحالی عمیق و بعد قهر و دعوا',
      'نمیدونم چمه، نمیدونم کار درست چیه، خیلی گیجم، خیلی آشفتم',
      'بابام گربلاس... وقتی بابام هست چند دقیقه نمیتونم تحملش کنم و همش تو اتاقم با در قفلم'
    ],
    تحلیل_بالینی:
      'الگوی آشفته با تعارض شدید بین نیاز به نزدیکی و ترس از آن مشخص می‌شود. فرد دچار نوسان‌های هیجانی، سردرگمی در تصمیم‌گیری و عدم انسجام در استراتژی‌های رابطه‌ای است. چرخه‌های تکراری رابطه (نزدیکی، تعارض، فاصله‌گیری) و اشاره به تجربه‌های دشوار با پدر می‌تواند نشان‌دهنده ریشه‌های دلبستگی اولیه ناایمن باشد. این الگو بیانگر عدم ثبات در سیستم دلبستگی و فعال‌سازی همزمان سیستم‌های متناقض (approach/avoidance) است.'
  }
};

const clinicalDisorderAnalysisData = {
  اختلالات: {
    'اختلال افسردگی اساسی': {
      اطمینان: 80,
      شواهد: [
        '۱ هفته اس حموم نرفتم به جز اون روزی که قرار بود برم خونشون',
        'حال روحیم بد میشه',
        'کاری نمیکنم',
        'دوباره آشفتم',
        'نا امنم',
        'حس خفگی دارم'
      ],
      تحلیل_بالینی:
        'متن نشان‌دهنده علائم قابل توجه افسردگی شامل کاهش انگیزه و کناره‌گیری از فعالیت‌های روزمره (حمام نرفتن، انجام ندادن کارها)، خلق پایین و احساس بدحالی روانی است. همچنین احساس ناامنی و خفگی می‌تواند با اضطراب همراه افسردگی همخوان باشد. این الگو نشان‌دهنده افت عملکرد و کاهش انرژی است که با معیارهای DSM-5-TR برای افسردگی اساسی سازگار است.'
    },
    'اختلال اضطراب فراگیر': {
      اطمینان: 75,
      شواهد: [
        'این چراها همش توی سرمه',
        'توی دوگانگیم',
        'همه ی خواسته ها درونم دو وجهین',
        'خیلی گیجم',
        'اعصابم خورد میشه ببینمشون'
      ],
      تحلیل_بالینی:
        'نشانه‌هایی از نگرانی مداوم، نشخوار فکری و دشواری در کنترل افکار اضطرابی وجود دارد. فرد درگیر دوگانگی ذهنی و سردرگمی در تصمیم‌گیری است. این الگو همراه با تحریک‌پذیری و تنش هیجانی می‌تواند با معیارهای اختلال اضطراب فراگیر همخوانی داشته باشد.'
    }
  }
};

const cognitiveDistortionAnalysisData = {
  distortions: {
    'All-or-Nothing Thinking': {
      score: 5,
      evidence: [
        'نمیخوام بهش متعهد باشم و نمیخوام تعهد رو خراب کنم',
        'مگه میشه آدم همزمان دو تا چیز رو بخواد ؟ اونم انقدر متضاد ؟'
      ],
      summary: 'شواهدی از دوگانگی و تفکر سیاه‌وسفید در خواسته‌های متناقض و احساس تعهد.'
    },
    'Mind Reading': {
      score: 7,
      evidence: [
        'تو دلت میخواد منو ببینی صدامو بشنوی',
        'میدونم میخواد احساس گناه بهم بده بعدا که پیاماش و جواب ندادم'
      ],
      summary: 'باور قطعی درباره افکار و نیت‌های طرف مقابل بدون شواهد کافی.'
    },
    'Negative Future Prediction': {
      score: 6,
      evidence: [
        'چرا انقدر امید دارم ۲ سال دیگه یا ۵ سال دیگه تغییر کرده باشه ؟ اونکه امروز نشون داد هموز دنبال تحقیر کردن منه ؟',
        'انگار میدونم دوباره با همین آدمی که تغییر نکرده برمیگردم'
      ],
      summary: 'پیش‌بینی منفی و قطعی درباره تکرار الگوهای گذشته و عدم تغییر.'
    },
    Personalization: {
      score: 6,
      evidence: [
        'چرا من باید با بوی گردن اون توی اون لحظه یاد یه نفر دیگه بیوفتم چه مشکلی دارم من ؟',
        'نکنه واقعا آدمیم که هیچ تعهد اخلاقی نداره ؟'
      ],
      summary: 'خود را مسئول و مقصر دانستن برای یک خاطره طبیعی و نسبت دادن آن به نقص اخلاقی.'
    },
    Labeling: {
      score: 4,
      evidence: ['نکنه واقعا آدمیم که هیچ تعهد اخلاقی نداره ؟'],
      summary: 'برچسب زدن منفی به کل شخصیت خود بر اساس یک رویداد.'
    }
  }
};

const cognitiveDistortionPersianLabels: Record<string, string> = {
  'All-or-Nothing Thinking': 'تفکر همه یا هیچ',
  'Mind Reading': 'ذهن‌خوانی',
  'Negative Future Prediction': 'پیش‌بینی منفی آینده',
  Personalization: 'شخصی‌سازی',
  Labeling: 'برچسب‌زنی'
};

/** خروجی پنج عامل بزرگ شخصیت برای مراجع تست (هم‌راستا با `frontend/test_output.json`) */
const personalTraitAnalysisData = {
  traits: {
    Neuroticism: {
      score: 95 / 10,
      evidence: [
        'احساس گناه و عذاب وجدان شدیدی داشتم و دارم',
        'اعصابم خورد میشه ببینمشون',
        'آشفتم / نا امنم / حس خفگی دارم',
        'خیلی گیجم / خیلی آشفتم',
        'میدونم هرگز امنیت نداشتم توی این رابطه',
        'دوباره آشفتم / نا امنم'
      ],
      summary:
        'قطب: بالا — اطمینان مدل: ۹۵٪\n\nگزارش مکرر احساس گناه، عذاب وجدان، آشفتگی، ناامنی، خفگی عاطفی و سردرگمی نشان‌دهنده نمره بالای روان‌رنجوری است. مؤلفه‌هایی مانند اضطراب (نگرانی از اشتباهات اخلاقی)، افسردگی (بی‌حالی و عدم حمام گرفتن به مدت یک هفته)، آسیب‌پذیری (احساس عدم امنیت در رابطه) و خودآگاهی منفی (شک به ارزشمندی خود) به وضوح در متن حضور دارند.'
    },
    Conscientiousness: {
      score: 80 / 10,
      evidence: [
        '۱ هفته اس حموم نرفتم به جز اون روزی که قرار بود برم خونشون',
        'کاری نمیکنم',
        'خونه ام اجمالی تمیز کردم',
        'همش فکر'
      ],
      summary:
        'قطب: پایین — اطمینان مدل: ۸۰٪\n\nنشانه‌های پایین بودن وظیفه‌شناسی شامل غفلت از بهداشت شخصی (یک هفته حمام نرفتن)، فقدان انضباط روزانه (کاری نمیکنم)، نظافت سطحی و ناقص منزل، و گرایش به سرگردانی ذهنی بدون اقدام عملی است. این الگو حاکی از پایینی مسئولیت‌پذیری، نظم و پشتکار است.'
    },
    'Openness to Experience': {
      score: 75 / 10,
      evidence: [
        'دلم میخواد آزاد تر زندگی کنم و رها باشم',
        'انسانها عاشق طرف میشن یا لحظاتشون ؟',
        'عشقه ؟ وابستگی عاطفی نا امنه ؟',
        'همه ی خواسته ها درونم دو وجهین',
        'کتاب / نوشتن / فکر'
      ],
      summary:
        'قطب: بالا — اطمینان مدل: ۷۵٪\n\nتجربه‌گری بالا از طریق کنجکاوی فلسفی (پرسش در مورد ماهیت عشق و وابستگی)، پذیرش تضادهای درونی (دووجهی بودن خواسته‌ها)، تمایل به آزادی و رهایی از قیدوبندها، و درگیری با فعالیت‌های تأملی مانند کتاب خواندن و نوشتن آشکار است. فرد به ارزش‌های غیرمتعارف و احساسات پیچیده خود گشودگی نشان می‌دهد.'
    }
  }
};

const relationalPatternAnalysisData = {
  relational_pattern: {
    'Recurrent Conflict Pattern': {
      score: 8,
      evidence: ['رفتارای تکراری قهر و دعوا بعد خوشحالی عمیق و بعد قهر و دعوا', 'من بر میگردم اول چرخه'],
      summary: 'الگوی تکراری از قهر و دعوا و سپس خوشحالی عمیق، بازگشت به چرخه'
    },
    'Unhealthy Dependence': {
      score: 6,
      evidence: ['دوست دارم باشه ولی عمیقا دلم نمیخواد باشه', 'میدونم دوباره با همین آدمی که تغییر نکرده برمیگردم'],
      summary: 'نیاز عاطفی به حضور او در عین آگاهی از آسیب‌زایی رابطه'
    },
    'Push-Pull / Rejection-Cling Cycle': {
      score: 7,
      evidence: ['هر بار میبینمت من بر میگردم اول چرخه', 'نمیخوام ببینمت ولی امید دارم ۲ سال دیگه تغییر کرده باشه'],
      summary: 'رفتار متناوب طرد و جذب نسبت به طرف مقابل'
    },
    'Controlling Behavior': {
      score: 7,
      evidence: ['خیلی مهمه کسی دستش به تن و بدنت نخوره', 'حلقه رو چرا نگه داشتی', 'دنبال تحقیر و توهین من میگردی'],
      summary: 'کنترل بر بدن و روابط کاربر، همراه با تحقیر و بازجویی'
    }
  }
};

const functionalLevelAnalysisData = {
  functional_level: {
    'Social Functioning': {
      score: 7,
      evidence: [
        'وقتی بابام هست چند دقیقه نمیتونم تحملش کنم و همش تو اتاقم با در قفلم',
        'بهش گفتم هربار میبینمت ... بر میگردم اول چرخه',
        'دلش میخواد منو ببینی صدامو بشنوی',
        'حس خفگی دارم'
      ],
      summary:
        'تعاملات با پارتنر سابق به شکل سمی و چرخه‌ای ادامه دارد و حضور پدر غیرقابل تحمل است، که منجر به انزوای شدید شده است.'
    },
    'Concentration / Attention Difficulties': {
      score: 6,
      evidence: ['این چراها همش توی سرمه', 'خیلی گیجم', 'همه ی خواسته ها درونم دووجهین'],
      summary: 'افکار مزاحم و دوگانگی شدید باعث اختلال در تمرکز و تصمیم‌گیری روزمره شده است.'
    }
  }
};

const functionalLevelPersianLabels: Record<string, string> = {
  'Social Functioning': 'عملکرد اجتماعی',
  'Concentration / Attention Difficulties': 'مشکل تمرکز / توجه'
};

const relationalPatternPersianLabels: Record<string, string> = {
  'Recurrent Conflict Pattern': 'الگوی تعارض تکرارشونده',
  'Unhealthy Dependence': 'وابستگی ناسالم',
  'Push-Pull / Rejection-Cling Cycle': 'چرخه طرد-جذب',
  'Controlling Behavior': 'رفتار کنترل‌گرانه'
};

const personalTraitPersianLabels: Record<string, string> = {
  Neuroticism: 'روان‌رنجوری (NEO)',
  Conscientiousness: 'وجدان‌کاری (NEO)',
  'Openness to Experience': 'تجربه‌گری (NEO)'
};

const clinicalSummaryIntro =
  'کاربر از سردرگمی شدید، دوسوگرایی و فشار روانی ناشی از یک رابطه عاطفی گذشته یا در حال فروپاشی صحبت می‌کند.';

const clinicalSummarySections = [
  {
    title: 'محور اصلی تجربه',
    content:
      'بوی گردن فردی جدید (یا فعلی)، او را یاد فرد دیگری به نام «ماهان» انداخته و همین موضوع باعث احساس گناه و عذاب وجدان شدید شده است. کاربر بارها از خود می‌پرسد آیا دچار مشکل اخلاقی است یا نمی‌تواند به تعهداتش پایبند بماند.'
  },
  {
    title: 'الگوی رابطه و فشار بین‌فردی',
    content:
      'کاربر تماس‌های مکرر طرف مقابل را توصیف می‌کند که با بهانه‌های مختلف (از جمله ارائه ایده شغلی برای نگهداری از حیوانات) تلاش می‌کند ارتباط را حفظ کند؛ اما کاربر این رفتار را تحقیرآمیز می‌بیند و معتقد است این تعامل‌ها او را به چرخه سمی گذشته برمی‌گرداند. همچنین احساس می‌کند طرف مقابل با ایجاد احساس گناه، به دنبال کنترل هیجانی اوست.'
  },
  {
    title: 'تعارض درونی',
    content:
      'کاربر از بی‌ثباتی، ناامنی، احساس خفگی و الگوی تکرارشونده «قهر، دعوا، شادی عمیق» در رابطه صحبت می‌کند.',
    bullets: ['هم دلتنگ طرف مقابل است', 'هم عمیقاً نمی‌خواهد به رابطه بازگردد']
  },
  {
    title: 'زمینه خانوادگی و تنظیم هیجان',
    content:
      'کاربر اشاره می‌کند در حضور پدر احساس امنیت ندارد و خود را در اتاق حبس می‌کند؛ در مقابل، حضور مادر برای او آرامش‌بخش است.'
  },
  {
    title: 'جمع‌بندی',
    content:
      'در پایان، کاربر بیان می‌کند که خواهان «ثبات» و «آزادی» است، هنوز نمی‌داند انتخاب درست چیست، و همچنان احساس گیجی و آشفتگی دارد. با این حال، از اینکه در برابر فشار رابطه‌ای، از تن دادن به خواسته‌های فیزیکی طرف مقابل خودداری کرده، احساس رضایت دارد.'
  }
];
interface SessionNotesViewProps {
  patients: Patient[];
  onBack: () => void;
  /** باز کردن مستقیم منوی یک مراجع دارای پرونده (از تقویم کلینیک یا لینک عمیق) */
  initialPatientId?: string | null;
  /** صفحهٔ اختصاصی `/dashboard/forms/patients/[id]` — بدون شبکهٔ انتخاب مراجع؛ بازگشت همیشه به `onBack` */
  standalonePatientId?: string | null;
}

type AnalysisMode =
  | 'clinical'
  | 'schema'
  | 'attachment'
  | 'clinical_disorder'
  | 'cognitive_distortion'
  | 'personal_train'
  | 'relational_pattern'
  | 'functional_level';

const ANALYSIS_TABS: { mode: AnalysisMode; label: string }[] = [
  { mode: 'clinical', label: 'خلاصه بالینی مکالمه' },
  { mode: 'schema', label: 'طرحواره' },
  { mode: 'attachment', label: 'دلبستگی' },
  { mode: 'clinical_disorder', label: 'اختلالات بالینی' },
  { mode: 'cognitive_distortion', label: 'تحریف‌های شناختی' },
  { mode: 'personal_train', label: 'ویژگی‌های شخصیتی' },
  { mode: 'relational_pattern', label: 'الگوهای رابطه‌ای' },
  { mode: 'functional_level', label: 'سطح عملکرد' },
];

function resolveInitialPatientId(
  patientsList: Patient[],
  initialPatientId: string | null | undefined,
  standalonePatientId: string | null | undefined,
): string | null {
  const target = standalonePatientId ?? initialPatientId;
  if (target && patientsList.some((p) => p.id === target)) return target;
  return null;
}

export function SessionNotesView({
  patients,
  onBack,
  initialPatientId = null,
  standalonePatientId = null,
}: SessionNotesViewProps) {
  const router = useRouter();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(() =>
    resolveInitialPatientId(patients, initialPatientId, standalonePatientId),
  );
  const [selectedView, setSelectedView] = useState<'menu' | 'notes' | 'analysis'>('menu');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('clinical');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);

  useEffect(() => {
    const target = standalonePatientId ?? initialPatientId;
    if (!target || patients.length === 0) return;
    const exists = patients.some((p) => p.id === target);
    if (exists) {
      setSelectedPatientId(target);
      setSelectedView('menu');
      setAnalysisMode('clinical');
    }
  }, [initialPatientId, standalonePatientId, patients]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const effectiveSelectedId =
    selectedPatientId ??
    (standalonePatientId &&
    patients.some((p) => p.id === standalonePatientId)
      ? standalonePatientId
      : null);

  const selectedPatient = patients.find((p) => p.id === effectiveSelectedId);
  const sessionNotes = useMemo(
    () => (effectiveSelectedId ? buildSessionNotes(effectiveSelectedId) : []),
    [effectiveSelectedId],
  );
  const schemaEntries = Object.entries(schemaAnalysisData).sort((a, b) => b[1].نمره - a[1].نمره);
  const attachmentEntries = Object.entries(attachmentAnalysisData);
  const attachmentScoreEntries = [...attachmentEntries].sort((a, b) => b[1].نمره - a[1].نمره);
  const clinicalDisorderEntries = Object.entries(clinicalDisorderAnalysisData.اختلالات);
  const clinicalDisorderScoreEntries = [...clinicalDisorderEntries].sort((a, b) => b[1].اطمینان - a[1].اطمینان);
  const cognitiveDistortionEntries = Object.entries(cognitiveDistortionAnalysisData.distortions);
  const cognitiveDistortionScoreEntries = [...cognitiveDistortionEntries].sort((a, b) => b[1].score - a[1].score);
  const personalTraitEntries = Object.entries(personalTraitAnalysisData.traits);
  const personalTraitScoreEntries = [...personalTraitEntries].sort((a, b) => b[1].score - a[1].score);
  const relationalPatternEntries = Object.entries(relationalPatternAnalysisData.relational_pattern);
  const relationalPatternScoreEntries = [...relationalPatternEntries].sort((a, b) => b[1].score - a[1].score);
  const functionalLevelEntries = Object.entries(functionalLevelAnalysisData.functional_level);
  const functionalLevelScoreEntries = [...functionalLevelEntries].sort((a, b) => b[1].score - a[1].score);
  const chartWidth = Math.max(760, schemaEntries.length * 170);
  const chartColors = ['#7C3AED', '#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (standalonePatientId) {
                onBack();
                return;
              }
              if (selectedPatientId && selectedView !== 'menu') {
                setSelectedView('menu');
              } else if (selectedPatientId) {
                setSelectedPatientId(null);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-primary/5 border border-border hover:border-primary/30 transition-all duration-200"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت</span>
          </button>
          <div>
            <h2 className="text-2xl text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f2c94c] to-[#e0b73c] flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              {!effectiveSelectedId || !selectedPatient
                ? 'یادداشت‌های جلسات'
                : selectedView === 'menu'
                ? `انتخاب نوع مشاهده - ${selectedPatient.name}`
                : selectedView === 'notes'
                ? `یادداشت‌های جلسات - ${selectedPatient.name}`
                : `تحلیل هوش مصنوعی - ${selectedPatient.name}`}
            </h2>
            <p className="text-muted-foreground mt-1 mr-14">
              {!effectiveSelectedId || !selectedPatient
                ? standalonePatientId
                  ? 'بارگذاری…'
                  : 'انتخاب مراجع برای مشاهده یادداشت‌ها'
                : selectedView === 'menu'
                ? 'یکی از گزینه‌های زیر را انتخاب کنید'
                : selectedView === 'notes'
                ? `${sessionNotes.length} جلسه ثبت شده`
                : 'نمای کلی تحلیل هوش مصنوعی مراجع'}
            </p>
          </div>
        </div>
        {selectedPatient && selectedView === 'notes' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAiSummary(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-white text-primary hover:bg-primary/5 hover:shadow-md transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">خلاصه با هوش مصنوعی</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/new-note')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#f2c94c] to-[#e0b73c] text-white hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>یادداشت جدید</span>
            </button>
          </div>
        )}
      </motion.div>

      {selectedPatient && (
        <SessionNotesAiSummaryDialog
          open={showAiSummary}
          onOpenChange={setShowAiSummary}
          patientName={selectedPatient.name}
          notes={sessionNotes.map((n) => ({
            id: n.id,
            date: n.date,
            dateMs: n.dateMs,
            sessionNumber: n.sessionNumber,
            duration: n.duration,
            mood: n.mood,
            mainTopics: n.mainTopics,
            chiefComplaint: n.chiefComplaint,
            historyBackground: n.historyBackground,
            sessionObjective: n.sessionObjective,
            summary: n.summary,
            formulation: n.formulation,
            treatmentPlan: n.treatmentPlan,
            homework: n.homework,
            nextSessionGoals: n.nextSessionGoals,
          }))}
        />
      )}

      <AnimatePresence mode="wait">
        {!standalonePatientId && !effectiveSelectedId ? (
          // Patients List
          <motion.div
            key="patients-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="جستجوی مراجع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                dir="rtl"
              />
              <User className="w-5 h-5 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient, index) => {
                const noteCount = Math.floor(Math.random() * 5) + 3;
                const lastSession = new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000);
                
                return (
                  <Link
                    key={patient.id}
                    href={`/dashboard/forms/patients/${encodeURIComponent(patient.id)}`}
                    className="block"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="group p-5 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-foreground mb-1 group-hover:text-primary transition-colors">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          آخرین جلسه: {lastSession.toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    </div>
                    <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{noteCount} جلسه</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        patient.status === 'safe' 
                          ? 'bg-[#6fcf97]/10 text-[#6fcf97]'
                          : patient.status === 'attention'
                          ? 'bg-[#f2c94c]/10 text-[#f2c94c]'
                          : 'bg-[#eb5757]/10 text-[#eb5757]'
                      }`}>
                        {patient.status === 'safe' ? 'ایمن' : patient.status === 'attention' ? 'نیاز به توجه' : 'فوری'}
                      </div>
                    </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground">مراجعی یافت نشد</p>
              </div>
            )}
          </motion.div>
        ) : effectiveSelectedId && selectedView === 'menu' ? (
          <motion.div
            key="patient-view-menu"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button
              onClick={() => setSelectedView('notes')}
              className="text-right p-6 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-foreground">یادداشت جلسات</h3>
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">مشاهده یادداشت‌های مراجع</p>
            </button>

            <button
              onClick={() => setSelectedView('analysis')}
              className="text-right p-6 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-foreground">تحلیل هوش مصنوعی</h3>
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">مشاهده تحلیل خلاصه مراجع</p>
            </button>
          </motion.div>
        ) : effectiveSelectedId && selectedView === 'notes' ? (
          // Session Notes List
          <motion.div
            key="notes-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {sessionNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                dir="rtl"
              >
                {/* Note Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f2c94c]/20 to-[#e0b73c]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg text-[#f2c94c]">#{note.sessionNumber}</span>
                    </div>
                    <div>
                      <h3 className="text-lg text-foreground mb-1">جلسه {note.sessionNumber}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{note.date}</span>
                        </div>
                        <span>•</span>
                        <span>{note.duration}</span>
                        <span>•</span>
                        <span className="text-primary">حال عمومی: {note.mood}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[#eb5757]/10 text-muted-foreground hover:text-[#eb5757] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Topics */}
                <div className="mb-4">
                  <h4 className="text-sm text-muted-foreground mb-2 text-right">موضوعات اصلی:</h4>
                  <div className="flex flex-wrap gap-2">
                    {note.mainTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-primary/5 text-sm text-foreground border border-primary/10"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2 text-right">۱. شکایت اصلی مراجع</h4>
                    <p className="text-foreground leading-relaxed text-right">{note.chiefComplaint}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2 text-right">۲. پیشینه و سابقه مشکل</h4>
                    <p className="text-foreground leading-relaxed text-right">{note.historyBackground}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2 text-right">۳. دستور و هدف جلسه فعلی</h4>
                    <p className="text-foreground leading-relaxed text-right">{note.sessionObjective}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2 text-right">۴. خلاصه جلسه</h4>
                    <p className="text-foreground leading-relaxed text-right">{note.summary}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2 text-right">۵. فرمولاسیون و تحلیل بالینی</h4>
                    <p className="text-foreground leading-relaxed text-right">{note.formulation}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2 text-right">۶. طرح درمان</h4>
                    <p className="text-foreground leading-relaxed text-right">{note.treatmentPlan}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2 text-right">۷. تکالیف و تمرین‌های خانگی</h4>
                    <p className="text-foreground leading-relaxed text-right">{note.homework}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-l from-primary/5 to-transparent border border-primary/10">
                  <h4 className="text-sm text-muted-foreground mb-2 text-right">اهداف جلسه بعد:</h4>
                  <p className="text-foreground leading-relaxed text-right">{note.nextSessionGoals}</p>
                </div>
              </motion.div>
            ))}

            {sessionNotes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground mb-4">هنوز یادداشتی ثبت نشده است</p>
                <button 
                  onClick={() => router.push('/dashboard/new-note')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-l from-[#f2c94c] to-[#e0b73c] text-white hover:shadow-lg transition-all duration-300"
                >
                  ایجاد اولین یادداشت
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="analysis-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="w-full rounded-2xl border border-border/60 bg-muted/20 p-2 sm:p-3">
              <div
                className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 lg:gap-2.5"
                dir="rtl"
                role="tablist"
                aria-label="انواع تحلیل"
              >
                {ANALYSIS_TABS.map(({ mode, label }) => {
                  const active = analysisMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setAnalysisMode(mode)}
                      className={cn(
                        'flex min-h-[3.75rem] w-full items-center justify-center rounded-xl border px-2 py-2.5 text-center text-[11px] font-medium leading-snug transition-all duration-200 sm:min-h-[3.5rem] sm:px-2.5 sm:text-xs sm:leading-tight',
                        active
                          ? 'border-primary bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15'
                          : 'border-border bg-white text-foreground hover:border-primary/35 hover:bg-muted/30',
                      )}
                    >
                      <span className="line-clamp-3">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {analysisMode === 'clinical' ? (
              <div className="p-6 rounded-xl bg-white border border-border">
                <h3 className="text-lg text-foreground mb-4 text-right">خلاصه بالینی مکالمه</h3>

                <div className="rounded-xl border border-primary/15 bg-gradient-to-l from-primary/10 to-transparent p-4 mb-5">
                  <p className="text-foreground text-right leading-8">{clinicalSummaryIntro}</p>
                </div>

                <div className="space-y-3">
                  {clinicalSummarySections.map((section) => (
                    <div key={section.title} className="rounded-xl border border-border bg-white p-4">
                      <h4 className="text-base text-foreground text-right mb-2">{section.title}</h4>
                      <p className="text-muted-foreground text-right leading-8">{section.content}</p>
                      {section.bullets && section.bullets.length > 0 && (
                        <ul className="mt-3 pr-5 list-disc space-y-1 text-muted-foreground text-right">
                          {section.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : analysisMode === 'schema' ? (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
                  <h4 className="text-base text-foreground text-right mb-4">نمودار ستونی شدت طرحواره‌ها</h4>
                  <div className="rounded-xl border border-border/60 bg-white p-4">
                    <div className="h-80 w-full overflow-x-auto">
                      <div className="w-full h-full flex justify-center">
                      <svg
                        width={chartWidth}
                        height={300}
                        viewBox={`0 0 ${chartWidth} 300`}
                        role="img"
                        aria-label="Schema probability bar chart"
                      >
                        {([0, 25, 50, 75, 100] as const).map((tick) => {
                          const y = 240 - (tick / 100) * 180;
                          return (
                            <g key={`tick-${tick}`}>
                              <line x1={60} y1={y} x2={chartWidth - 20} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                              <text x={66} y={y + 4} textAnchor="start" fontSize="11" fill="#6b7280">{tick}</text>
                            </g>
                          );
                        })}

                        <line x1={60} y1={240} x2={chartWidth - 20} y2={240} stroke="#d1d5db" strokeWidth="1.5" />
                        <line x1={60} y1={60} x2={60} y2={240} stroke="#d1d5db" strokeWidth="1.5" />
                        <text x={24} y={150} textAnchor="middle" fontSize="11" fill="#6b7280" transform="rotate(-90 24 150)">
                          احتمال مدل
                        </text>

                        {schemaEntries.map(([schemaName, schema], index) => {
                          const barWidth = 58;
                          const availableWidth = chartWidth - 120;
                          const gap = availableWidth / Math.max(1, schemaEntries.length);
                          const x = 60 + gap * index + (gap - barWidth) / 2;
                          const barHeight = (schema.نمره / 100) * 180;
                          const y = 240 - barHeight;
                          const color = chartColors[index % chartColors.length];
                          const label = schemaName.length > 16 ? `${schemaName.slice(0, 16)}...` : schemaName;
                          return (
                            <g key={`svg-bar-${schemaName}`}>
                              <rect x={x} y={y} width={barWidth} height={barHeight} rx={8} ry={8} fill={color} />
                              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#111827">
                                {schema.نمره}
                              </text>
                              <text x={x + barWidth / 2} y={264} textAnchor="middle" fontSize="11" fill="#6b7280">
                                {label}
                              </text>
                            </g>
                          );
                        })}
                        <text x={chartWidth / 2} y={292} textAnchor="middle" fontSize="12" fill="#6b7280">
                          طرحواره‌ها
                        </text>
                      </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-border">
                  <h3 className="text-lg text-foreground text-right mb-2">تحلیل طرحواره (JSON)</h3>
                  <p className="text-sm text-muted-foreground text-right">
                    شدت هر طرحواره بر اساس احتمال مدل از ۱۰۰ نمایش داده شده است.
                  </p>
                </div>

                {schemaEntries.map(([schemaName, schema]) => (
                  <div key={schemaName} className="p-5 rounded-xl bg-white border border-border shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm">
                        {schemaName}
                      </span>
                      <span className="text-sm text-foreground">
                        احتمال مدل: <span className="text-primary">{schema.نمره}</span>/100
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${schema.نمره}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            schema.نمره >= 90
                              ? 'bg-gradient-to-l from-[#eb5757] to-[#f29999]'
                              : schema.نمره >= 80
                              ? 'bg-gradient-to-l from-[#f2c94c] to-[#f6db86]'
                              : 'bg-gradient-to-l from-[#6fcf97] to-[#9be2b7]'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm text-foreground mb-2 text-right">شواهد</h4>
                      <ul className="space-y-2 list-disc pr-5 text-right text-sm text-muted-foreground leading-7">
                        {schema.شواهد.map((evidence, index) => (
                          <li key={`${schemaName}-evidence-${index}`}>{evidence}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/40 border border-border">
                        <h4 className="text-sm font-medium text-foreground mb-2 text-right">
                          باور بنیادین
                        </h4>
                        <p className="text-sm text-muted-foreground text-right leading-8">
                          {schema.باور_بنیادین}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <h4 className="text-sm font-medium text-foreground mb-2 text-right">
                          تحلیل بالینی
                        </h4>
                        <p className="text-sm text-muted-foreground text-right leading-8">
                          {schema.تحلیل_بالینی}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : analysisMode === 'attachment' ? (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-border">
                  <h3 className="text-lg text-foreground text-right mb-2">تحلیل سبک دلبستگی</h3>
                  <p className="text-sm text-muted-foreground text-right">
                    احتمال هر سبک دلبستگی در بازه ۰ تا ۱۰ نمایش داده شده است.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
                  <h4 className="text-base text-foreground text-right mb-4">نمودار ستونی سبک‌های دلبستگی</h4>
                  <div className="rounded-xl border border-border/60 bg-white p-4">
                    <div className="h-80 w-full overflow-x-auto">
                      <div className="w-full h-full flex justify-center">
                        <svg
                          width={Math.max(760, attachmentScoreEntries.length * 170)}
                          height={300}
                          viewBox={`0 0 ${Math.max(760, attachmentScoreEntries.length * 170)} 300`}
                          role="img"
                          aria-label="Attachment probability bar chart"
                        >
                          {([0, 2, 4, 6, 8, 10] as const).map((tick) => {
                            const y = 240 - (tick / 10) * 180;
                            return (
                              <g key={`attachment-tick-${tick}`}>
                                <line
                                  x1={60}
                                  y1={y}
                                  x2={Math.max(760, attachmentScoreEntries.length * 170) - 20}
                                  y2={y}
                                  stroke="#e5e7eb"
                                  strokeWidth="1"
                                />
                                <text x={66} y={y + 4} textAnchor="start" fontSize="11" fill="#6b7280">
                                  {tick}
                                </text>
                              </g>
                            );
                          })}

                          <line
                            x1={60}
                            y1={240}
                            x2={Math.max(760, attachmentScoreEntries.length * 170) - 20}
                            y2={240}
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                          />
                          <line x1={60} y1={60} x2={60} y2={240} stroke="#d1d5db" strokeWidth="1.5" />
                          <text x={24} y={150} textAnchor="middle" fontSize="11" fill="#6b7280" transform="rotate(-90 24 150)">
                            احتمال مدل
                          </text>

                          {attachmentScoreEntries.map(([styleName, attachmentData], index) => {
                            const barWidth = 58;
                            const chartWidth = Math.max(760, attachmentScoreEntries.length * 170);
                            const availableWidth = chartWidth - 120;
                            const gap = availableWidth / Math.max(1, attachmentScoreEntries.length);
                            const x = 60 + gap * index + (gap - barWidth) / 2;
                            const barHeight = (attachmentData.نمره / 10) * 180;
                            const y = 240 - barHeight;
                            const color = chartColors[index % chartColors.length];
                            const label = styleName.length > 16 ? `${styleName.slice(0, 16)}...` : styleName;

                            return (
                              <g key={`svg-attachment-${styleName}`}>
                                <rect x={x} y={y} width={barWidth} height={barHeight} rx={8} ry={8} fill={color} />
                                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#111827">
                                  {attachmentData.نمره}
                                </text>
                                <text x={x + barWidth / 2} y={264} textAnchor="middle" fontSize="11" fill="#6b7280">
                                  {label}
                                </text>
                              </g>
                            );
                          })}
                          <text
                            x={Math.max(760, attachmentScoreEntries.length * 170) / 2}
                            y={292}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#6b7280"
                          >
                            سبک‌های دلبستگی
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
                  <h4 className="text-base text-foreground text-right mb-4">نمرات سبک‌های دلبستگی</h4>
                  <div className="space-y-3">
                    {attachmentScoreEntries.map(([styleName, attachmentData]) => (
                      <div key={`attachment-score-${styleName}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-foreground">{styleName}</span>
                          <span className="text-sm text-primary">{attachmentData.نمره}/10</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(attachmentData.نمره / 10) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              attachmentData.نمره >= 8
                                ? 'bg-gradient-to-l from-[#ef4444] to-[#f87171]'
                                : attachmentData.نمره >= 5
                                ? 'bg-gradient-to-l from-[#f59e0b] to-[#fbbf24]'
                                : 'bg-gradient-to-l from-[#22c55e] to-[#4ade80]'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {attachmentEntries.map(([styleName, attachmentData]) => (
                  <div key={`attachment-evidence-${styleName}`} className="p-5 rounded-xl bg-white border border-border shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm">
                        {styleName}
                      </span>
                      <span className="text-sm text-foreground">
                        احتمال مدل:{' '}
                        <span className="text-primary">
                          {attachmentData.نمره}/10
                        </span>
                      </span>
                    </div>
                    {attachmentData.شواهد.length > 0 ? (
                      <ul className="space-y-2 list-disc pr-5 text-right text-sm text-muted-foreground leading-7">
                        {attachmentData.شواهد.map((evidence, index) => (
                          <li key={`${styleName}-evidence-${index}`}>{evidence}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground text-right">شواهد معناداری برای این سبک گزارش نشده است.</p>
                    )}
                    <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="text-sm text-foreground mb-2 text-right">تحلیل بالینی</h4>
                      <p className="text-sm text-muted-foreground text-right leading-8">
                        {attachmentData.تحلیل_بالینی}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : analysisMode === 'clinical_disorder' ? (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-border">
                  <h3 className="text-lg text-foreground text-right mb-2">تحلیل اختلالات بالینی</h3>
                  <p className="text-sm text-muted-foreground text-right">
                    شدت احتمالی هر اختلال در بازه ۰ تا ۱۰ نمایش داده شده است.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
                  <h4 className="text-base text-foreground text-right mb-4">نمودار ستونی اختلالات بالینی</h4>
                  <div className="rounded-xl border border-border/60 bg-white p-4">
                    <div className="h-80 w-full overflow-x-auto">
                      <div className="w-full h-full flex justify-center">
                        <svg
                          width={Math.max(820, clinicalDisorderScoreEntries.length * 170)}
                          height={300}
                          viewBox={`0 0 ${Math.max(820, clinicalDisorderScoreEntries.length * 170)} 300`}
                          role="img"
                          aria-label="Clinical disorder probability bar chart"
                        >
                          {([0, 2, 4, 6, 8, 10] as const).map((tick) => {
                            const y = 240 - (tick / 10) * 180;
                            return (
                              <g key={`clinical-tick-${tick}`}>
                                <line
                                  x1={60}
                                  y1={y}
                                  x2={Math.max(820, clinicalDisorderScoreEntries.length * 170) - 20}
                                  y2={y}
                                  stroke="#e5e7eb"
                                  strokeWidth="1"
                                />
                                <text x={66} y={y + 4} textAnchor="start" fontSize="11" fill="#6b7280">
                                  {tick}
                                </text>
                              </g>
                            );
                          })}

                          <line
                            x1={60}
                            y1={240}
                            x2={Math.max(820, clinicalDisorderScoreEntries.length * 170) - 20}
                            y2={240}
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                          />
                          <line x1={60} y1={60} x2={60} y2={240} stroke="#d1d5db" strokeWidth="1.5" />
                          <text x={24} y={150} textAnchor="middle" fontSize="11" fill="#6b7280" transform="rotate(-90 24 150)">
                            احتمال مدل
                          </text>

                          {clinicalDisorderScoreEntries.map(([disorderName, score], index) => {
                            const barWidth = 58;
                            const chartWidth = Math.max(820, clinicalDisorderScoreEntries.length * 170);
                            const availableWidth = chartWidth - 120;
                            const gap = availableWidth / Math.max(1, clinicalDisorderScoreEntries.length);
                            const x = 60 + gap * index + (gap - barWidth) / 2;
                            const barHeight = (score.اطمینان / 100) * 180;
                            const y = 240 - barHeight;
                            const color = chartColors[index % chartColors.length];
                            const label = disorderName.length > 16 ? `${disorderName.slice(0, 16)}...` : disorderName;

                            return (
                              <g key={`svg-clinical-${disorderName}`}>
                                <rect x={x} y={y} width={barWidth} height={barHeight} rx={8} ry={8} fill={color} />
                                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#111827">
                                  {score.اطمینان}
                                </text>
                                <text x={x + barWidth / 2} y={264} textAnchor="middle" fontSize="11" fill="#6b7280">
                                  {label}
                                </text>
                              </g>
                            );
                          })}
                          <text
                            x={Math.max(820, clinicalDisorderScoreEntries.length * 170) / 2}
                            y={292}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#6b7280"
                          >
                            اختلالات بالینی
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {clinicalDisorderEntries.map(([disorderName, disorderData]) => (
                  <div key={`clinical-evidence-${disorderName}`} className="p-5 rounded-xl bg-white border border-border shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm">
                        {disorderName}
                      </span>
                      <span className="text-sm text-foreground">
                        احتمال مدل:{' '}
                        <span className="text-primary">
                          {disorderData.اطمینان}/100
                        </span>
                      </span>
                    </div>
                    {disorderData.شواهد.length > 0 ? (
                      <ul className="space-y-2 list-disc pr-5 text-right text-sm text-muted-foreground leading-7">
                        {disorderData.شواهد.map((evidence, index) => (
                          <li key={`${disorderName}-evidence-${index}`}>{evidence}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground text-right">شواهد معناداری برای این اختلال گزارش نشده است.</p>
                    )}
                    <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="text-sm text-foreground mb-2 text-right">تحلیل بالینی</h4>
                      <p className="text-sm text-muted-foreground text-right leading-8">{disorderData.تحلیل_بالینی}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : analysisMode === 'cognitive_distortion' ? (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-border">
                  <h3 className="text-lg text-foreground text-right mb-2">تحلیل تحریف‌های شناختی</h3>
                  <p className="text-sm text-muted-foreground text-right">
                    شدت هر تحریف شناختی در بازه ۰ تا ۱۰ نمایش داده شده است.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
                  <h4 className="text-base text-foreground text-right mb-4">نمودار ستونی تحریف‌های شناختی</h4>
                  <div className="rounded-xl border border-border/60 bg-white p-4">
                    <div className="h-80 w-full overflow-x-auto">
                      <div className="w-full h-full flex justify-center">
                        <svg
                          width={Math.max(820, cognitiveDistortionScoreEntries.length * 170)}
                          height={300}
                          viewBox={`0 0 ${Math.max(820, cognitiveDistortionScoreEntries.length * 170)} 300`}
                          role="img"
                          aria-label="Cognitive distortions bar chart"
                        >
                          {([0, 2, 4, 6, 8, 10] as const).map((tick) => {
                            const y = 240 - (tick / 10) * 180;
                            return (
                              <g key={`distortion-tick-${tick}`}>
                                <line
                                  x1={60}
                                  y1={y}
                                  x2={Math.max(820, cognitiveDistortionScoreEntries.length * 170) - 20}
                                  y2={y}
                                  stroke="#e5e7eb"
                                  strokeWidth="1"
                                />
                                <text x={66} y={y + 4} textAnchor="start" fontSize="11" fill="#6b7280">
                                  {tick}
                                </text>
                              </g>
                            );
                          })}

                          <line
                            x1={60}
                            y1={240}
                            x2={Math.max(820, cognitiveDistortionScoreEntries.length * 170) - 20}
                            y2={240}
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                          />
                          <line x1={60} y1={60} x2={60} y2={240} stroke="#d1d5db" strokeWidth="1.5" />
                          <text x={24} y={150} textAnchor="middle" fontSize="11" fill="#6b7280" transform="rotate(-90 24 150)">
                            احتمال مدل
                          </text>

                          {cognitiveDistortionScoreEntries.map(([distortionName, distortionData], index) => {
                            const barWidth = 58;
                            const chartWidth = Math.max(820, cognitiveDistortionScoreEntries.length * 170);
                            const availableWidth = chartWidth - 120;
                            const gap = availableWidth / Math.max(1, cognitiveDistortionScoreEntries.length);
                            const x = 60 + gap * index + (gap - barWidth) / 2;
                            const barHeight = (distortionData.score / 10) * 180;
                            const y = 240 - barHeight;
                            const color = chartColors[index % chartColors.length];
                            const localizedName = cognitiveDistortionPersianLabels[distortionName] ?? distortionName;
                            const label = localizedName.length > 16 ? `${localizedName.slice(0, 16)}...` : localizedName;

                            return (
                              <g key={`svg-distortion-${distortionName}`}>
                                <rect x={x} y={y} width={barWidth} height={barHeight} rx={8} ry={8} fill={color} />
                                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#111827">
                                  {distortionData.score}
                                </text>
                                <text x={x + barWidth / 2} y={264} textAnchor="middle" fontSize="11" fill="#6b7280">
                                  {label}
                                </text>
                              </g>
                            );
                          })}
                          <text
                            x={Math.max(820, cognitiveDistortionScoreEntries.length * 170) / 2}
                            y={292}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#6b7280"
                          >
                            تحریف‌های شناختی
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {cognitiveDistortionEntries.map(([distortionName, distortionData]) => (
                  <div key={`distortion-card-${distortionName}`} className="p-5 rounded-xl bg-white border border-border shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm">
                        {cognitiveDistortionPersianLabels[distortionName] ?? distortionName}
                      </span>
                      <span className="text-sm text-foreground">
                        احتمال مدل: <span className="text-primary">{distortionData.score}</span>/10
                      </span>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm text-foreground mb-2 text-right">شواهد</h4>
                      <ul className="space-y-2 list-disc pr-5 text-right text-sm text-muted-foreground leading-7">
                        {distortionData.evidence.map((evidence, index) => (
                          <li key={`${distortionName}-evidence-${index}`}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="text-sm text-foreground mb-2 text-right">خلاصه</h4>
                      <p className="text-sm text-muted-foreground text-right leading-8">{distortionData.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : analysisMode === 'personal_train' ? (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-border">
                  <h3 className="text-lg text-foreground text-right mb-2">تحلیل ویژگی‌های شخصیتی</h3>
                  <p className="text-sm text-muted-foreground text-right">
                    شدت هر trait در بازه ۰ تا ۱۰ نمایش داده شده است.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
                  <h4 className="text-base text-foreground text-right mb-4">نمودار ستونی ویژگی‌های شخصیتی</h4>
                  <div className="rounded-xl border border-border/60 bg-white p-4">
                    <div className="h-80 w-full overflow-x-auto">
                      <div className="w-full h-full flex justify-center">
                        <svg
                          width={Math.max(760, personalTraitScoreEntries.length * 170)}
                          height={300}
                          viewBox={`0 0 ${Math.max(760, personalTraitScoreEntries.length * 170)} 300`}
                          role="img"
                          aria-label="Personal traits bar chart"
                        >
                          {([0, 2, 4, 6, 8, 10] as const).map((tick) => {
                            const y = 240 - (tick / 10) * 180;
                            return (
                              <g key={`trait-tick-${tick}`}>
                                <line
                                  x1={60}
                                  y1={y}
                                  x2={Math.max(760, personalTraitScoreEntries.length * 170) - 20}
                                  y2={y}
                                  stroke="#e5e7eb"
                                  strokeWidth="1"
                                />
                                <text x={66} y={y + 4} textAnchor="start" fontSize="11" fill="#6b7280">
                                  {tick}
                                </text>
                              </g>
                            );
                          })}
                          <line
                            x1={60}
                            y1={240}
                            x2={Math.max(760, personalTraitScoreEntries.length * 170) - 20}
                            y2={240}
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                          />
                          <line x1={60} y1={60} x2={60} y2={240} stroke="#d1d5db" strokeWidth="1.5" />
                          <text x={24} y={150} textAnchor="middle" fontSize="11" fill="#6b7280" transform="rotate(-90 24 150)">
                            احتمال مدل
                          </text>

                          {personalTraitScoreEntries.map(([traitName, traitData], index) => {
                            const barWidth = 58;
                            const chartWidth = Math.max(760, personalTraitScoreEntries.length * 170);
                            const availableWidth = chartWidth - 120;
                            const gap = availableWidth / Math.max(1, personalTraitScoreEntries.length);
                            const x = 60 + gap * index + (gap - barWidth) / 2;
                            const barHeight = (traitData.score / 10) * 180;
                            const y = 240 - barHeight;
                            const color = chartColors[index % chartColors.length];
                            const localizedName = personalTraitPersianLabels[traitName] ?? traitName;
                            const label = localizedName.length > 16 ? `${localizedName.slice(0, 16)}...` : localizedName;
                            return (
                              <g key={`svg-trait-${traitName}`}>
                                <rect x={x} y={y} width={barWidth} height={barHeight} rx={8} ry={8} fill={color} />
                                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#111827">
                                  {traitData.score}
                                </text>
                                <text x={x + barWidth / 2} y={264} textAnchor="middle" fontSize="11" fill="#6b7280">
                                  {label}
                                </text>
                              </g>
                            );
                          })}
                          <text
                            x={Math.max(760, personalTraitScoreEntries.length * 170) / 2}
                            y={292}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#6b7280"
                          >
                            ویژگی‌های شخصیتی
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {personalTraitEntries.map(([traitName, traitData]) => (
                  <div key={`trait-card-${traitName}`} className="p-5 rounded-xl bg-white border border-border shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm">
                        {personalTraitPersianLabels[traitName] ?? traitName}
                      </span>
                      <span className="text-sm text-foreground">
                        احتمال مدل: <span className="text-primary">{traitData.score}</span>/10
                      </span>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm text-foreground mb-2 text-right">شواهد</h4>
                      <ul className="space-y-2 list-disc pr-5 text-right text-sm text-muted-foreground leading-7">
                        {traitData.evidence.map((evidence, index) => (
                          <li key={`${traitName}-evidence-${index}`}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="text-sm text-foreground mb-2 text-right">خلاصه</h4>
                      <p className="text-sm text-muted-foreground text-right leading-8">{traitData.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : analysisMode === 'relational_pattern' ? (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-border">
                  <h3 className="text-lg text-foreground text-right mb-2">تحلیل الگوهای رابطه‌ای</h3>
                  <p className="text-sm text-muted-foreground text-right">
                    شدت هر الگوی رابطه‌ای در بازه ۰ تا ۱۰ نمایش داده شده است.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
                  <h4 className="text-base text-foreground text-right mb-4">نمودار ستونی الگوهای رابطه‌ای</h4>
                  <div className="rounded-xl border border-border/60 bg-white p-4">
                    <div className="h-80 w-full overflow-x-auto">
                      <div className="w-full h-full flex justify-center">
                        <svg
                          width={Math.max(760, relationalPatternScoreEntries.length * 170)}
                          height={300}
                          viewBox={`0 0 ${Math.max(760, relationalPatternScoreEntries.length * 170)} 300`}
                          role="img"
                          aria-label="Relational patterns bar chart"
                        >
                          {([0, 2, 4, 6, 8, 10] as const).map((tick) => {
                            const y = 240 - (tick / 10) * 180;
                            return (
                              <g key={`relation-tick-${tick}`}>
                                <line
                                  x1={60}
                                  y1={y}
                                  x2={Math.max(760, relationalPatternScoreEntries.length * 170) - 20}
                                  y2={y}
                                  stroke="#e5e7eb"
                                  strokeWidth="1"
                                />
                                <text x={66} y={y + 4} textAnchor="start" fontSize="11" fill="#6b7280">
                                  {tick}
                                </text>
                              </g>
                            );
                          })}
                          <line
                            x1={60}
                            y1={240}
                            x2={Math.max(760, relationalPatternScoreEntries.length * 170) - 20}
                            y2={240}
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                          />
                          <line x1={60} y1={60} x2={60} y2={240} stroke="#d1d5db" strokeWidth="1.5" />
                          <text x={24} y={150} textAnchor="middle" fontSize="11" fill="#6b7280" transform="rotate(-90 24 150)">
                            احتمال مدل
                          </text>

                          {relationalPatternScoreEntries.map(([patternName, patternData], index) => {
                            const barWidth = 58;
                            const chartWidth = Math.max(760, relationalPatternScoreEntries.length * 170);
                            const availableWidth = chartWidth - 120;
                            const gap = availableWidth / Math.max(1, relationalPatternScoreEntries.length);
                            const x = 60 + gap * index + (gap - barWidth) / 2;
                            const barHeight = (patternData.score / 10) * 180;
                            const y = 240 - barHeight;
                            const color = chartColors[index % chartColors.length];
                            const localizedName = relationalPatternPersianLabels[patternName] ?? patternName;
                            const label = localizedName.length > 16 ? `${localizedName.slice(0, 16)}...` : localizedName;
                            return (
                              <g key={`svg-relation-${patternName}`}>
                                <rect x={x} y={y} width={barWidth} height={barHeight} rx={8} ry={8} fill={color} />
                                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#111827">
                                  {patternData.score}
                                </text>
                                <text x={x + barWidth / 2} y={264} textAnchor="middle" fontSize="11" fill="#6b7280">
                                  {label}
                                </text>
                              </g>
                            );
                          })}
                          <text
                            x={Math.max(760, relationalPatternScoreEntries.length * 170) / 2}
                            y={292}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#6b7280"
                          >
                            الگوهای رابطه‌ای
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {relationalPatternEntries.map(([patternName, patternData]) => (
                  <div key={`relation-card-${patternName}`} className="p-5 rounded-xl bg-white border border-border shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm">
                        {relationalPatternPersianLabels[patternName] ?? patternName}
                      </span>
                      <span className="text-sm text-foreground">
                        احتمال مدل: <span className="text-primary">{patternData.score}</span>/10
                      </span>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm text-foreground mb-2 text-right">شواهد</h4>
                      <ul className="space-y-2 list-disc pr-5 text-right text-sm text-muted-foreground leading-7">
                        {patternData.evidence.map((evidence, index) => (
                          <li key={`${patternName}-evidence-${index}`}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="text-sm text-foreground mb-2 text-right">خلاصه</h4>
                      <p className="text-sm text-muted-foreground text-right leading-8">{patternData.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-border">
                  <h3 className="text-lg text-foreground text-right mb-2">تحلیل سطح عملکرد</h3>
                  <p className="text-sm text-muted-foreground text-right">
                    شدت هر شاخص عملکردی در بازه ۰ تا ۱۰ نمایش داده شده است.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
                  <h4 className="text-base text-foreground text-right mb-4">نمودار ستونی سطح عملکرد</h4>
                  <div className="rounded-xl border border-border/60 bg-white p-4">
                    <div className="h-80 w-full overflow-x-auto">
                      <div className="w-full h-full flex justify-center">
                        <svg
                          width={Math.max(760, functionalLevelScoreEntries.length * 170)}
                          height={300}
                          viewBox={`0 0 ${Math.max(760, functionalLevelScoreEntries.length * 170)} 300`}
                          role="img"
                          aria-label="Functional level bar chart"
                        >
                          {([0, 2, 4, 6, 8, 10] as const).map((tick) => {
                            const y = 240 - (tick / 10) * 180;
                            return (
                              <g key={`functional-tick-${tick}`}>
                                <line
                                  x1={60}
                                  y1={y}
                                  x2={Math.max(760, functionalLevelScoreEntries.length * 170) - 20}
                                  y2={y}
                                  stroke="#e5e7eb"
                                  strokeWidth="1"
                                />
                                <text x={66} y={y + 4} textAnchor="start" fontSize="11" fill="#6b7280">
                                  {tick}
                                </text>
                              </g>
                            );
                          })}
                          <line
                            x1={60}
                            y1={240}
                            x2={Math.max(760, functionalLevelScoreEntries.length * 170) - 20}
                            y2={240}
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                          />
                          <line x1={60} y1={60} x2={60} y2={240} stroke="#d1d5db" strokeWidth="1.5" />
                          <text x={24} y={150} textAnchor="middle" fontSize="11" fill="#6b7280" transform="rotate(-90 24 150)">
                            احتمال مدل
                          </text>

                          {functionalLevelScoreEntries.map(([metricName, metricData], index) => {
                            const barWidth = 58;
                            const chartWidth = Math.max(760, functionalLevelScoreEntries.length * 170);
                            const availableWidth = chartWidth - 120;
                            const gap = availableWidth / Math.max(1, functionalLevelScoreEntries.length);
                            const x = 60 + gap * index + (gap - barWidth) / 2;
                            const barHeight = (metricData.score / 10) * 180;
                            const y = 240 - barHeight;
                            const color = chartColors[index % chartColors.length];
                            const localizedName = functionalLevelPersianLabels[metricName] ?? metricName;
                            const label = localizedName.length > 16 ? `${localizedName.slice(0, 16)}...` : localizedName;
                            return (
                              <g key={`svg-functional-${metricName}`}>
                                <rect x={x} y={y} width={barWidth} height={barHeight} rx={8} ry={8} fill={color} />
                                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#111827">
                                  {metricData.score}
                                </text>
                                <text x={x + barWidth / 2} y={264} textAnchor="middle" fontSize="11" fill="#6b7280">
                                  {label}
                                </text>
                              </g>
                            );
                          })}
                          <text
                            x={Math.max(760, functionalLevelScoreEntries.length * 170) / 2}
                            y={292}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#6b7280"
                          >
                            شاخص‌های سطح عملکرد
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {functionalLevelEntries.map(([metricName, metricData]) => (
                  <div key={`functional-card-${metricName}`} className="p-5 rounded-xl bg-white border border-border shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm">
                        {functionalLevelPersianLabels[metricName] ?? metricName}
                      </span>
                      <span className="text-sm text-foreground">
                        احتمال مدل: <span className="text-primary">{metricData.score}</span>/10
                      </span>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm text-foreground mb-2 text-right">شواهد</h4>
                      <ul className="space-y-2 list-disc pr-5 text-right text-sm text-muted-foreground leading-7">
                        {metricData.evidence.map((evidence, index) => (
                          <li key={`${metricName}-evidence-${index}`}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="text-sm text-foreground mb-2 text-right">خلاصه</h4>
                      <p className="text-sm text-muted-foreground text-right leading-8">{metricData.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Session Note Dialog */}
      {selectedPatient && (
        <AddSessionNoteDialog
          open={showAddNote}
          onClose={() => setShowAddNote(false)}
          patientName={selectedPatient.name}
          sessionNumber={sessionNotes.length + 1}
        />
      )}

    </div>
  );
}
