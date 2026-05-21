import type { BrandAmbassador } from '@/types/brandAmbassador';

const AMBASSADOR_SEED: BrandAmbassador[] = [
  {
    id: 'amb-1',
    name: 'سارا محمدی',
    phone: '۰۹۱۲ ۱۱۱ ۲۲۳۳',
    email: 'sara.m@example.com',
    referralCode: 'SARA-MH',
    joinedAt: '۱۴۰۲/۰۳/۱۲',
    status: 'active',
    avatarColor: '#7c3aed',
    invitedCount: 48,
    successfulSalesCount: 31,
    totalCommissionToman: 18_450_000,
    conversionRate: 64,
    performanceSummary:
      'عملکرد عالی؛ نرخ تبدیل بالا و ثبات در معرفی مراجع جدید در سه ماه اخیر.',
    invitedCustomers: [
      { id: 'c1', name: 'مریم احمدی', invitedAt: '۱۴۰۳/۰۸/۰۱', status: 'converted' },
      { id: 'c2', name: 'رضا کریمی', invitedAt: '۱۴۰۳/۰۷/۲۸', status: 'converted' },
      { id: 'c3', name: 'نیلوفر رضایی', invitedAt: '۱۴۰۳/۰۷/۲۰', status: 'registered' },
      { id: 'c4', name: 'امیر حسینی', invitedAt: '۱۴۰۳/۰۷/۱۵', status: 'pending' },
    ],
    salesHistory: [
      {
        id: 's1',
        customerName: 'مریم احمدی',
        productLabel: 'بسته ۸ جلسه درمان',
        amountToman: 4_800_000,
        commissionToman: 720_000,
        date: '۱۴۰۳/۰۸/۰۵',
        status: 'completed',
      },
      {
        id: 's2',
        customerName: 'رضا کریمی',
        productLabel: 'ارزیابی اولیه + ۴ جلسه',
        amountToman: 3_200_000,
        commissionToman: 480_000,
        date: '۱۴۰۳/۰۷/۳۰',
        status: 'completed',
      },
    ],
    commissionDetails: [
      { id: 'cm1', period: 'مرداد ۱۴۰۳', amountToman: 6_200_000, status: 'paid', paidAt: '۱۴۰۳/۰۶/۰۵' },
      { id: 'cm2', period: 'تیر ۱۴۰۳', amountToman: 5_100_000, status: 'paid', paidAt: '۱۴۰۳/۰۵/۰۳' },
      { id: 'cm3', period: 'مهر ۱۴۰۳', amountToman: 7_150_000, status: 'pending' },
    ],
  },
  {
    id: 'amb-2',
    name: 'علی رضایی',
    phone: '۰۹۳۵ ۴۴۴ ۵۵۶۶',
    email: 'ali.r@example.com',
    referralCode: 'ALI-RZ',
    joinedAt: '۱۴۰۲/۰۷/۰۱',
    status: 'active',
    avatarColor: '#2563eb',
    invitedCount: 36,
    successfulSalesCount: 22,
    totalCommissionToman: 12_800_000,
    conversionRate: 61,
    performanceSummary:
      'سفیر فعال با تمرکز بر معرفی در شبکه‌های اجتماعی؛ رشد ماهانه فروش مثبت.',
    invitedCustomers: [
      { id: 'c5', name: 'پریسا نوری', invitedAt: '۱۴۰۳/۰۸/۰۳', status: 'converted' },
      { id: 'c6', name: 'حامد جعفری', invitedAt: '۱۴۰۳/۰۷/۲۵', status: 'registered' },
    ],
    salesHistory: [
      {
        id: 's3',
        customerName: 'پریسا نوری',
        productLabel: 'مشاوره آنلاین ماهانه',
        amountToman: 2_400_000,
        commissionToman: 360_000,
        date: '۱۴۰۳/۰۸/۰۴',
        status: 'completed',
      },
    ],
    commissionDetails: [
      { id: 'cm4', period: 'مرداد ۱۴۰۳', amountToman: 4_300_000, status: 'paid', paidAt: '۱۴۰۳/۰۶/۰۸' },
      { id: 'cm5', period: 'مهر ۱۴۰۳', amountToman: 3_900_000, status: 'pending' },
    ],
  },
  {
    id: 'amb-3',
    name: 'مینا حسینی',
    phone: '۰۹۱۹ ۷۷۷ ۸۸۸۸',
    email: 'mina.h@example.com',
    referralCode: 'MINA-HS',
    joinedAt: '۱۴۰۲/۱۱/۱۸',
    status: 'active',
    avatarColor: '#059669',
    invitedCount: 29,
    successfulSalesCount: 18,
    totalCommissionToman: 9_600_000,
    conversionRate: 62,
    performanceSummary: 'تمرکز بر مراجع خانوادگی؛ نرخ بازگشت مشتری بالا.',
    invitedCustomers: [
      { id: 'c7', name: 'زهرا موسوی', invitedAt: '۱۴۰۳/۰۷/۱۰', status: 'converted' },
    ],
    salesHistory: [
      {
        id: 's4',
        customerName: 'زهرا موسوی',
        productLabel: 'جلسه خانواده (۳ نفر)',
        amountToman: 5_100_000,
        commissionToman: 765_000,
        date: '۱۴۰۳/۰۷/۱۸',
        status: 'completed',
      },
    ],
    commissionDetails: [
      { id: 'cm6', period: 'تیر ۱۴۰۳', amountToman: 3_200_000, status: 'paid', paidAt: '۱۴۰۳/۰۵/۰۱' },
      { id: 'cm7', period: 'مرداد ۱۴۰۳', amountToman: 2_800_000, status: 'pending' },
    ],
  },
  {
    id: 'amb-4',
    name: 'کاوه امینی',
    phone: '۰۹۱۰ ۳۳۳ ۲۲۱۱',
    email: 'kaveh.a@example.com',
    referralCode: 'KAVEH-AM',
    joinedAt: '۱۴۰۳/۰۱/۰۵',
    status: 'active',
    avatarColor: '#d97706',
    invitedCount: 22,
    successfulSalesCount: 14,
    totalCommissionToman: 7_200_000,
    conversionRate: 64,
    performanceSummary: 'سفیر تازه‌وارد با رشد سریع؛ پتانسیل ارتقا به سطح طلایی.',
    invitedCustomers: [
      { id: 'c8', name: 'سودابه کیانی', invitedAt: '۱۴۰۳/۰۸/۰۲', status: 'pending' },
    ],
    salesHistory: [
      {
        id: 's5',
        customerName: 'بهنام صادقی',
        productLabel: 'بسته ۴ جلسه',
        amountToman: 2_800_000,
        commissionToman: 420_000,
        date: '۱۴۰۳/۰۷/۲۲',
        status: 'completed',
      },
    ],
    commissionDetails: [
      { id: 'cm8', period: 'مرداد ۱۴۰۳', amountToman: 2_100_000, status: 'pending' },
    ],
  },
  {
    id: 'amb-5',
    name: 'لیلا اکبری',
    phone: '۰۹۳۶ ۵۵۵ ۶۶۷۷',
    email: 'leila.a@example.com',
    referralCode: 'LEILA-AK',
    joinedAt: '۱۴۰۲/۰۵/۲۰',
    status: 'active',
    avatarColor: '#db2777',
    invitedCount: 41,
    successfulSalesCount: 19,
    totalCommissionToman: 8_900_000,
    conversionRate: 46,
    performanceSummary: 'حجم دعوت بالا؛ نیاز به بهبود نرخ تبدیل با آموزش فروش.',
    invitedCustomers: [
      { id: 'c9', name: 'فرهاد باقری', invitedAt: '۱۴۰۳/۰۶/۱۵', status: 'registered' },
      { id: 'c10', name: 'شیدا مرادی', invitedAt: '۱۴۰۳/۰۶/۰۱', status: 'registered' },
    ],
    salesHistory: [
      {
        id: 's6',
        customerName: 'فرهاد باقری',
        productLabel: 'ارزیابی اولیه',
        amountToman: 1_200_000,
        commissionToman: 180_000,
        date: '۱۴۰۳/۰۶/۲۰',
        status: 'pending',
      },
    ],
    commissionDetails: [
      { id: 'cm9', period: 'خرداد ۱۴۰۳', amountToman: 4_500_000, status: 'paid', paidAt: '۱۴۰۳/۰۴/۰۵' },
      { id: 'cm10', period: 'تیر ۱۴۰۳', amountToman: 2_400_000, status: 'pending' },
    ],
  },
  {
    id: 'amb-6',
    name: 'پویا نادری',
    phone: '۰۹۱۵ ۹۹۹ ۰۰۱۱',
    email: 'pouya.n@example.com',
    referralCode: 'POUYA-ND',
    joinedAt: '۱۴۰۲/۰۹/۰۸',
    status: 'inactive',
    avatarColor: '#64748b',
    invitedCount: 15,
    successfulSalesCount: 6,
    totalCommissionToman: 2_400_000,
    conversionRate: 40,
    performanceSummary: 'فعالیت کم در دو ماه اخیر؛ پیگیری برای فعال‌سازی مجدد.',
    invitedCustomers: [
      { id: 'c11', name: 'آرمان شریفی', invitedAt: '۱۴۰۳/۰۴/۱۰', status: 'pending' },
    ],
    salesHistory: [],
    commissionDetails: [
      { id: 'cm11', period: 'فروردین ۱۴۰۳', amountToman: 1_800_000, status: 'paid', paidAt: '۱۴۰۳/۰۲/۰۱' },
    ],
  },
  {
    id: 'amb-7',
    name: 'نرگس قاسمی',
    phone: '۰۹۱۸ ۲۲۲ ۳۳۴۴',
    email: 'narges.q@example.com',
    referralCode: 'NARGES-Q',
    joinedAt: '۱۴۰۳/۰۲/۱۴',
    status: 'active',
    avatarColor: '#0891b2',
    invitedCount: 18,
    successfulSalesCount: 11,
    totalCommissionToman: 5_500_000,
    conversionRate: 61,
    performanceSummary: 'روند رو به رشد؛ تمرکز بر مشاوره پیش از درمان موفق بوده است.',
    invitedCustomers: [
      { id: 'c12', name: 'یاسمن فتحی', invitedAt: '۱۴۰۳/۰۷/۰۵', status: 'converted' },
    ],
    salesHistory: [
      {
        id: 's7',
        customerName: 'یاسمن فتحی',
        productLabel: 'پیش‌مشاوره + ۲ جلسه',
        amountToman: 2_100_000,
        commissionToman: 315_000,
        date: '۱۴۰۳/۰۷/۱۲',
        status: 'completed',
      },
    ],
    commissionDetails: [
      { id: 'cm12', period: 'تیر ۱۴۰۳', amountToman: 2_600_000, status: 'paid', paidAt: '۱۴۰۳/۰۵/۱۰' },
    ],
  },
  {
    id: 'amb-8',
    name: 'امیرحسین توکلی',
    phone: '۰۹۳۰ ۸۸۸ ۷۷۷۷',
    email: 'amir.t@example.com',
    referralCode: 'AMIR-TK',
    joinedAt: '۱۴۰۲/۰۴/۰۳',
    status: 'active',
    avatarColor: '#4f46e5',
    invitedCount: 52,
    successfulSalesCount: 28,
    totalCommissionToman: 15_200_000,
    conversionRate: 54,
    performanceSummary: 'بیشترین تعداد دعوت؛ پورسانت تجمیعی در رتبه دوم.',
    invitedCustomers: [
      { id: 'c13', name: 'مهدی پاکرو', invitedAt: '۱۴۰۳/۰۸/۰۴', status: 'converted' },
      { id: 'c14', name: 'الهام براتی', invitedAt: '۱۴۰۳/۰۷/۳۰', status: 'registered' },
    ],
    salesHistory: [
      {
        id: 's8',
        customerName: 'مهدی پاکرو',
        productLabel: 'بسته ۱۲ جلسه',
        amountToman: 7_200_000,
        commissionToman: 1_080_000,
        date: '۱۴۰۳/۰۸/۰۶',
        status: 'completed',
      },
    ],
    commissionDetails: [
      { id: 'cm13', period: 'مرداد ۱۴۰۳', amountToman: 5_800_000, status: 'paid', paidAt: '۱۴۰۳/۰۶/۰۱' },
      { id: 'cm14', period: 'مهر ۱۴۰۳', amountToman: 4_200_000, status: 'pending' },
    ],
  },
  {
    id: 'amb-9',
    name: 'هانیه زارعی',
    phone: '۰۹۱۳ ۶۶۶ ۵۵۵۵',
    email: 'haniye.z@example.com',
    referralCode: 'HANIYE-Z',
    joinedAt: '۱۴۰۳/۰۳/۲۲',
    status: 'pending',
    avatarColor: '#a855f7',
    invitedCount: 8,
    successfulSalesCount: 2,
    totalCommissionToman: 900_000,
    conversionRate: 25,
    performanceSummary: 'در انتظار تکمیل آموزش اولیه؛ فعالیت محدود پس از عضویت.',
    invitedCustomers: [
      { id: 'c15', name: 'سینا رحیمی', invitedAt: '۱۴۰۳/۰۶/۲۸', status: 'pending' },
    ],
    salesHistory: [
      {
        id: 's9',
        customerName: 'سینا رحیمی',
        productLabel: 'جلسه معارفه',
        amountToman: 600_000,
        commissionToman: 90_000,
        date: '۱۴۰۳/۰۷/۰۱',
        status: 'completed',
      },
    ],
    commissionDetails: [
      { id: 'cm15', period: 'تیر ۱۴۰۳', amountToman: 900_000, status: 'pending' },
    ],
  },
  {
    id: 'amb-10',
    name: 'بهرام صالحی',
    phone: '۰۹۳۳ ۱۲۳ ۴۵۶۷',
    email: 'bahram.s@example.com',
    referralCode: 'BAHRAM-S',
    joinedAt: '۱۴۰۲/۰۸/۱۱',
    status: 'active',
    avatarColor: '#ea580c',
    invitedCount: 25,
    successfulSalesCount: 16,
    totalCommissionToman: 8_100_000,
    conversionRate: 64,
    performanceSummary: 'نرخ تبدیل بالا با حجم متوسط؛ کاندیدای سفیر ویژه.',
    invitedCustomers: [
      { id: 'c16', name: 'گلناز عباسی', invitedAt: '۱۴۰۳/۰۷/۰۸', status: 'converted' },
    ],
    salesHistory: [
      {
        id: 's10',
        customerName: 'گلناز عباسی',
        productLabel: 'بسته ۶ جلسه',
        amountToman: 3_600_000,
        commissionToman: 540_000,
        date: '۱۴۰۳/۰۷/۱۴',
        status: 'completed',
      },
    ],
    commissionDetails: [
      { id: 'cm16', period: 'خرداد ۱۴۰۳', amountToman: 3_100_000, status: 'paid', paidAt: '۱۴۰۳/۰۴/۱۲' },
      { id: 'cm17', period: 'مرداد ۱۴۰۳', amountToman: 2_500_000, status: 'pending' },
    ],
  },
];

export function getBrandAmbassadors(): BrandAmbassador[] {
  return [...AMBASSADOR_SEED].sort(
    (a, b) => b.totalCommissionToman - a.totalCommissionToman,
  );
}

export function getAmbassadorById(id: string): BrandAmbassador | undefined {
  return AMBASSADOR_SEED.find((a) => a.id === id);
}

export function formatToman(amount: number): string {
  return `${amount.toLocaleString('fa-IR')} تومان`;
}

export function getAmbassadorRankings(
  ambassadors: BrandAmbassador[],
): (BrandAmbassador & { rank: number })[] {
  const sorted = [...ambassadors].sort(
    (a, b) => b.totalCommissionToman - a.totalCommissionToman,
  );
  return sorted.map((a, i) => ({ ...a, rank: i + 1 }));
}

export function getDashboardTotals(ambassadors: BrandAmbassador[]) {
  return {
    totalAmbassadors: ambassadors.length,
    activeCount: ambassadors.filter((a) => a.status === 'active').length,
    totalInvited: ambassadors.reduce((s, a) => s + a.invitedCount, 0),
    totalSales: ambassadors.reduce((s, a) => s + a.successfulSalesCount, 0),
    totalCommission: ambassadors.reduce((s, a) => s + a.totalCommissionToman, 0),
  };
}
