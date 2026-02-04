export const SCHEMA_TYPES = {
  'رهاشدگی/بی‌ثباتی': {
    english: 'Abandonment / Instability',
    description: 'ترس از رهاشدگی یا عدم حمایت عزیزان'
  },
  'بی‌اعتمادی/بدرفتاری': {
    english: 'Mistrust / Abuse',
    description: 'انتظار آسیب، فریب یا دستکاری از دیگران'
  },
  'محرومیت هیجانی': {
    english: 'Emotional Deprivation',
    description: 'باور به برآورده نشدن نیازهای هیجانی (عشق، همدلی، حمایت)'
  },
  'نقص/شرم': {
    english: 'Defectiveness / Shame',
    description: 'احساس عیب‌دار، نالایق یا غیرقابل دوست داشتن بودن'
  },
  'انزوای اجتماعی': {
    english: 'Social Isolation / Alienation',
    description: 'احساس متفاوت بودن، عدم تعلق به گروه یا طرد شدن'
  },
  'وابستگی/ناکارآمدی': {
    english: 'Dependence / Incompetence',
    description: 'باور به ناتوانی در مدیریت مسئولیت‌ها بدون کمک دیگران'
  },
  'بدبینی/آسیب‌پذیری': {
    english: 'Vulnerability to Harm or Illness',
    description: 'ترس از فاجعه، بیماری یا خطر قریب‌الوقوع'
  },
  'درهم‌تنیدگی/خود نارسیده': {
    english: 'Enmeshment / Undeveloped Self',
    description: 'درگیری هیجانی افراطی با دیگران و از دست دادن هویت شخصی'
  },
  'شکست': {
    english: 'Failure',
    description: 'باور به ناکافی بودن یا محکوم به شکست بودن در مقایسه با همتایان'
  },
  'استحقاق/خودبزرگ‌بینی': {
    english: 'Entitlement / Grandiosity',
    description: 'احساس برتری، انتظار رفتار ویژه یا عدم اعمال قوانین برای خود'
  },
  'خودانضباطی ناکافی': {
    english: 'Insufficient Self-Control / Self-Discipline',
    description: 'دشواری در کنترل تکانه‌ها یا تکمیل وظایف'
  },
  'تسلیم': {
    english: 'Subjugation',
    description: 'تسلیم افراطی به خواسته‌های دیگران از روی ترس یا احساس گناه'
  },
  'خودقربانی': {
    english: 'Self-Sacrifice',
    description: 'تمرکز افراطی بر نیازهای دیگران به قیمت سلامت خود'
  },
  'تأییدجویی/شناخت‌طلبی': {
    english: 'Approval-Seeking / Recognition-Seeking',
    description: 'تأکید بیش از حد بر کسب تأیید، توجه یا شناخت از دیگران'
  },
  'منفی‌نگری/بدبینی': {
    english: 'Negativity / Pessimism',
    description: 'تمرکز بر جنبه‌های منفی زندگی؛ انتظار شکست یا ناامیدی'
  },
  'مهار هیجانی': {
    english: 'Emotional Inhibition',
    description: 'سرکوب احساسات خودجوش برای جلوگیری از عدم تأیید یا شرم'
  },
  'معیارهای سرسختانه': {
    english: 'Unrelenting Standards / Hypercriticalness',
    description: 'تأکید افراطی بر کمال‌گرایی، قوانین یا انتظارات بالا'
  },
  'تنبیه': {
    english: 'Punitiveness',
    description: 'باور به اینکه افراد (خود یا دیگران) باید به شدت برای اشتباهات مجازات شوند'
  }
} as const;

export type SchemaType = keyof typeof SCHEMA_TYPES;
export const SCHEMA_TYPE_KEYS = Object.keys(SCHEMA_TYPES) as SchemaType[];
