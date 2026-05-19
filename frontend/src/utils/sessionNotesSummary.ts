export interface SessionNoteForSummary {
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

export interface LabeledItem {
  label?: string;
  text: string;
}

export interface ReportSection {
  number: number;
  title: string;
  intro?: string;
  body?: string;
  items?: LabeledItem[];
  bullets?: string[];
}

export interface NotesSummaryResult {
  title: string;
  dateRangeLabel: string;
  sessionCount: number;
  sessionDurationLabel: string;
  approach: string;
  sections: ReportSection[];
  insight?: {
    title: string;
    body: string;
  };
}

function formatFaDateRange(fromMs: number, toMs: number): string {
  const from = new Date(fromMs);
  const to = new Date(toMs);
  const monthYear = from.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' });
  const dayFrom = from.toLocaleDateString('fa-IR', { day: 'numeric' });
  const dayTo = to.toLocaleDateString('fa-IR', { day: 'numeric' });
  if (
    from.getMonth() === to.getMonth() &&
    from.getFullYear() === to.getFullYear()
  ) {
    return `${dayFrom} تا ${dayTo} ${monthYear}`;
  }
  const fmt = (ms: number) =>
    new Date(ms).toLocaleDateString('fa-IR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  return `${fmt(fromMs)} — ${fmt(toMs)}`;
}

export function filterNotesByDateRange(
  notes: SessionNoteForSummary[],
  fromMs: number,
  toMs: number,
): SessionNoteForSummary[] {
  const start = Math.min(fromMs, toMs);
  const end = Math.max(fromMs, toMs);
  return notes
    .filter((n) => n.dateMs >= start && n.dateMs <= end)
    .sort((a, b) => a.dateMs - b.dateMs);
}

function buildDemoSummary(
  notes: SessionNoteForSummary[],
  patientName: string,
  fromMs: number,
  toMs: number,
): NotesSummaryResult {
  const n = notes.length;
  const duration = notes[0]?.duration ?? '۴۵ دقیقه';

  return {
    title: `خلاصه روند درمانی مراجع (${patientName})`,
    dateRangeLabel: formatFaDateRange(fromMs, toMs),
    sessionCount: n,
    sessionDurationLabel: `${n} جلسه ${duration}‌ای`,
    approach: 'شناختی-رفتاری (CBT)',
    sections: [
      {
        number: 1,
        title: 'تصویر کلی از روند درمان',
        body:
          'مراجع طی این ۴ هفته یک نوسان هیجانی طبیعی را تجربه کرده است؛ از حالت «آرام» در جلسه اول، به «مضطرب» و سپس «غمگین» رسیده و در نهایت در جلسه چهارم احساس «امیدواری» داشته است. این تغییرات می‌تواند نشان‌دهنده درگیری فعال مراجع با محتوای جلسات و مواجهه با چالش‌های محیط کار باشد.',
      },
      {
        number: 2,
        title: 'شکایت اصلی و پیشینه (ثابت در تمام جلسات)',
        items: [
          {
            label: 'شکایت اصلی',
            text: 'اضطراب مداوم در محیط کار و اختلال در خواب.',
          },
          {
            label: 'پیشینه',
            text: 'علائم از شش ماه پیش تشدید شده و سابقه خانوادگی اضطراب وجود دارد.',
          },
          {
            label: 'محرک اصلی',
            text: 'اضطراب عملکردی، به‌ویژه هنگام ارائه در جلسات کاری.',
          },
        ],
      },
      {
        number: 3,
        title: 'هسته اصلی تحلیل بالینی شما',
        intro: 'شما یک الگوی شناختی-رفتاری مشخص را شناسایی کرده‌اید:',
        items: [
          { label: 'محرک', text: 'موقعیت‌های ارائه.' },
          { label: 'الگوی ناکارآمد', text: 'اجتناب.' },
          {
            label: 'باور مرکزی',
            text: 'ترس از قضاوت شدن توسط دیگران.',
          },
        ],
        body:
          'این الگو، درمان را به سمت تکنیک‌های مواجهه تدریجی و بازسازی باورهای ناکارآمد هدایت کرده است.',
      },
      {
        number: 4,
        title: 'مداخلات و تکنیک‌های ثابت جلسات',
        intro: 'در تمام جلسات، محورهای زیر ثابت بوده‌اند:',
        bullets: [
          'آموزش و تمرین ذهن‌آگاهی',
          'بررسی احساسات هفته گذشته',
          'بررسی و تحلیل چالش‌های محیط کار (در جلسات ۱، ۲ و ۴)',
        ],
      },
      {
        number: 5,
        title: 'تکالیف خانگی تعیین‌شده',
        intro:
          'مجموعه‌ای از تمرینات مشخص برای مراجع در نظر گرفته شده که به نظر می‌رسد در جلسات بعدی نیز پیگیری آن‌ها ادامه دارد:',
        bullets: [
          'انجام تمرینات تنفسی روزانه',
          'ثبت احساسات در دفترچه یادداشت',
          'تمرین گفتگوی مثبت با خود',
        ],
      },
      {
        number: 6,
        title: 'اهداف تعیین‌شده برای جلسات آینده',
        intro: 'بر اساس یادداشت‌های شما، نقشه راه درمان به این سمت در حال حرکت است:',
        bullets: [
          'فاز اول: ارزیابی پیشرفت در تکالیف خانگی (پایش مستمر).',
          'فاز دوم: عمیق‌تر شدن کار روی طرحواره‌های شناختی.',
          'فاز سوم: گسترش تمرکز درمان به حوزه روابط بین‌فردی.',
        ],
      },
    ],
    insight: {
      title: 'نکته قابل تأمل',
      body:
        'متن «خلاصه جلسه» در هر چهار یادداشت عیناً تکرار شده است («مراجع در این جلسه پیشرفت خوبی در مدیریت احساسات خود نشان داد…»). در حالی که حال عمومی مراجع متغیر بوده، این بخش یکدست باقی مانده است. برای واقعی‌تر شدن دمو، شاید بهتر باشد در نسخه نهایی، این بخش نیز بازتابی از پویایی هر جلسه باشد.',
    },
  };
}

export function generateSessionNotesSummary(
  notes: SessionNoteForSummary[],
  patientName: string,
  fromMs: number,
  toMs: number,
): NotesSummaryResult | null {
  const filtered = filterNotesByDateRange(notes, fromMs, toMs);
  if (filtered.length === 0) return null;
  return buildDemoSummary(filtered, patientName, fromMs, toMs);
}

export async function simulateAiSummaryDelay(onStep: (step: number) => void): Promise<void> {
  const steps = [
    'در حال خواندن یادداشت‌های بازه…',
    'در حال تهیه خلاصهٔ بالینی…',
    'در حال آماده‌سازی گزارش…',
  ];
  for (let step = 0; step < steps.length; step += 1) {
    onStep(step);
    await new Promise((r) => setTimeout(r, 900 + step * 400));
  }
}
