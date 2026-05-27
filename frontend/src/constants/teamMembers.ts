export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageSrc?: string;
  accent: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'babavalian',
    name: 'آقای دکتر باباوالیان',
    role: 'دکتری هوش مصنوعی · استاد دانشگاه',
    bio: 'دکتری هوش مصنوعی و استاد دانشگاه؛ پژوهش و تدریس در حوزه یادگیری ماشین و سیستم‌های هوشمند.',
    accent: '#7c3aed',
  },
  {
    id: 'esfandiari',
    name: 'خانم دکتر اسفندیاری',
    role: 'دکتری هوش مصنوعی · استاد دانشگاه · متخصص LLM',
    bio: 'دکتری هوش مصنوعی و استاد دانشگاه؛ تخصص در مدل‌های زبانی بزرگ (LLM) و پردازش زبان طبیعی.',
    accent: '#2563eb',
  },
  {
    id: 'rayan',
    name: 'آقای آرش ریان',
    role: 'مهندس هوش مصنوعی · بنیان‌گذار',
    bio: 'بنیان‌گذار روانصد؛ مسئول معماری فنی پلتفرم و توسعه محصول.',
    imageSrc: '/team/rayan.jpg',
    accent: '#0891b2',
  },
  {
    id: 'dehghani',
    name: 'آقای دکتر هادی دهقانی',
    role: 'استاد دانشگاه · درمانگر زوج‌درمانی',
    bio: 'استاد دانشگاه با ۱۵ سال سابقه درمان زوج‌درمانی؛ نظارت بر استانداردهای بالینی.',
    imageSrc: '/team/dehghani.png',
    accent: '#059669',
  },
  {
    id: 'shokravi',
    name: 'خانم دکتر شیرین شکروی',
    role: 'طرحواره‌درمانی · ۱۵ سال سابقه',
    bio: 'متخصص طرحواره‌درمانی با ۱۵ سال تجربه بالینی در حوزه سلامت روان.',
    accent: '#db2777',
  },
  {
    id: 'mardani',
    name: 'آقای پرویز مردانی',
    role: 'مدیر برند · کارشناسی ارشد روانشناسی',
    bio: 'مسئول برند و ارتباط با جامعه درمانگران و شبکه همکاران.',
    imageSrc: '/team/parvis.jpg',
    accent: '#d97706',
  },
];
