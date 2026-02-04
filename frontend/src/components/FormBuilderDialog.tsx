import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check, FileText, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface FormItem {
  id: string;
  title: string;
}

interface FormSubcategory {
  id: string;
  title: string;
  items: FormItem[];
}

interface FormCategory {
  id: string;
  title: string;
  subcategories: FormSubcategory[];
}

const formCategories: FormCategory[] = [
  {
    id: 'child',
    title: 'مشکلات کودک و نوجوان',
    subcategories: [
      {
        id: 'behavioral',
        title: 'مشکلات رفتاری',
        items: [
          { id: 'disobedience', title: 'نافرمانی و عدم اطاعت' },
          { id: 'aggression', title: 'پرخاشگری و خشونت' },
          { id: 'antisocial', title: 'رفتارهای ضد اجتماعی' }
        ]
      },
      {
        id: 'academic',
        title: 'مشکلات تحصیلی',
        items: [
          { id: 'academic_decline', title: 'افت تحصیلی' },
          { id: 'no_motivation', title: 'عدم انگیزه برای یادگیری' },
          { id: 'concentration', title: 'مشکلات در تمرکز و توجه' }
        ]
      },
      {
        id: 'emotional',
        title: 'مشکلات عاطفی',
        items: [
          { id: 'anxiety', title: 'اضطراب و نگرانی' },
          { id: 'depression', title: 'افسردگی و ناامیدی' },
          { id: 'loneliness', title: 'احساس تنهایی یا بی‌ارزشی' }
        ]
      },
      {
        id: 'social',
        title: 'مشکلات اجتماعی',
        items: [
          { id: 'communication', title: 'عدم توانایی در برقراری ارتباط با دیگران' },
          { id: 'friendship', title: 'مشکلات در دوستیابی' },
          { id: 'rejection', title: 'احساس طرد شدن' }
        ]
      },
      {
        id: 'sleep',
        title: 'مشکلات خواب',
        items: [
          { id: 'insomnia', title: 'بی‌خوابی یا خواب زیاد' },
          { id: 'nightmares', title: 'ترس از خواب یا کابوس‌های شبانه' }
        ]
      },
      {
        id: 'nutrition',
        title: 'مشکلات تغذیه',
        items: [
          { id: 'eating_disorder', title: 'بدغذایی یا پرخوری' },
          { id: 'eating_issues', title: 'اختلالات خوردن (بی‌اشتهایی، پرخوری عصبی)' }
        ]
      },
      {
        id: 'family',
        title: 'مشکلات خانوادگی',
        items: [
          { id: 'family_conflicts', title: 'اختلافات خانوادگی' },
          { id: 'divorce', title: 'طلاق یا جدایی والدین' },
          { id: 'negative_environment', title: 'تأثیرات منفی محیط خانواده' }
        ]
      },
      {
        id: 'identity',
        title: 'مشکلات هویتی',
        items: [
          { id: 'identity_confusion', title: 'سردرگمی درباره هویت جنسی یا اجتماعی' },
          { id: 'peer_pressure', title: 'فشارهای همسالان' }
        ]
      },
      {
        id: 'technology',
        title: 'مشکلات فناوری',
        items: [
          { id: 'internet_addiction', title: 'اعتیاد به اینترنت یا بازی‌های ویدیویی' },
          { id: 'social_media', title: 'استفاده نامناسب از شبکه‌های اجتماعی' }
        ]
      },
      {
        id: 'health',
        title: 'مشکلات سلامتی',
        items: [
          { id: 'chronic_illness', title: 'بیماری‌های جسمی مزمن' },
          { id: 'mental_disorders', title: 'مشکلات روانی (ADHD، اوتیسم)' }
        ]
      },
      {
        id: 'other_child',
        title: 'سایر موارد',
        items: [
          { id: 'future_concern', title: 'نگرانی درباره آینده کودک یا نوجوان' },
          { id: 'social_pressure', title: 'فشارهای اجتماعی و فرهنگی' },
          { id: 'parent_counseling', title: 'نیاز به مشاوره برای والدین' }
        ]
      }
    ]
  },
  {
    id: 'work_academic_org',
    title: 'مشکلات شغلی، تحصیلی و سازمانی',
    subcategories: [
      {
        id: 'work',
        title: 'مشکلات شغلی',
        items: [
          { id: 'job_dissatisfaction', title: 'عدم رضایت شغلی' },
          { id: 'job_selection', title: 'مشکلات در انتخاب شغل' },
          { id: 'career_advancement', title: 'مشکلات در پیشرفت شغلی' },
          { id: 'workplace_communication', title: 'مشکلات ارتباطی در محیط کار' },
          { id: 'work_stress', title: 'استرس و فشار شغلی' },
          { id: 'job_change', title: 'مشکلات مربوط به تغییر شغل' },
          { id: 'lack_skills', title: 'عدم مهارت‌های لازم' }
        ]
      },
      {
        id: 'academic_issues',
        title: 'مشکلات تحصیلی',
        items: [
          { id: 'academic_decline_adult', title: 'افت تحصیلی' },
          { id: 'major_selection', title: 'مشکلات انتخاب رشته' },
          { id: 'learning_problems', title: 'مشکلات یادگیری (تمرکز، اختلالات یادگیری)' },
          { id: 'exam_stress', title: 'استرس امتحانات' },
          { id: 'teacher_communication', title: 'مشکلات ارتباطی با معلمان و همکلاسی‌ها' },
          { id: 'time_management', title: 'مدیریت زمان و برنامه‌ریزی' }
        ]
      },
      {
        id: 'organizational',
        title: 'مشکلات سازمانی',
        items: [
          { id: 'org_culture', title: 'مشکلات فرهنگی سازمانی' },
          { id: 'change_management', title: 'مدیریت تغییرات سازمانی' },
          { id: 'employee_motivation', title: 'عدم انگیزه کارکنان' },
          { id: 'performance_management', title: 'مدیریت عملکرد' },
          { id: 'leadership', title: 'مشکلات رهبری و مدیریت' }
        ]
      },
      {
        id: 'other_work',
        title: 'سایر موارد',
        items: [
          { id: 'career_future', title: 'نگرانی درباره آینده شغلی یا تحصیلی' },
          { id: 'social_cultural_pressure', title: 'فشارهای اجتماعی و فرهنگی' },
          { id: 'family_counseling', title: 'نیاز به مشاوره برای والدین یا خانواده‌ها' }
        ]
      }
    ]
  },
  {
    id: 'individual',
    title: 'مشکلات روان‌درمانی فردی',
    subcategories: [
      {
        id: 'mental_issues',
        title: 'مشکلات روانی',
        items: [
          { id: 'anxiety_general', title: 'اضطراب و نگرانی (عمومی، پانیک، نگرانی‌های مداوم)' },
          { id: 'depression_general', title: 'افسردگی (غم، ناامیدی، بی‌ارزشی)' },
          { id: 'stress', title: 'استرس و فشار روانی (کار، تحصیل، تغییرات زندگی)' },
          { id: 'communication_issues', title: 'مشکلات ارتباطی (احساس تنهایی، طرد شدن)' }
        ]
      },
      {
        id: 'sleep_disorders',
        title: 'اختلالات خواب',
        items: [
          { id: 'insomnia_adult', title: 'بی‌خوابی یا خواب زیاد' },
          { id: 'recurring_nightmares', title: 'کابوس‌های مکرر' }
        ]
      },
      {
        id: 'emotional_problems',
        title: 'مشکلات عاطفی',
        items: [
          { id: 'emotion_management', title: 'ناتوانی در مدیریت احساسات' },
          { id: 'anger_hopelessness', title: 'احساس خشم یا ناامیدی' }
        ]
      },
      {
        id: 'eating_disorders',
        title: 'اختلالات غذایی',
        items: [
          { id: 'overeating', title: 'پرخوری یا کم‌خوری' },
          { id: 'eating_disorders_clinical', title: 'اختلالات مانند بی‌اشتهایی یا پرخوری عصبی' }
        ]
      },
      {
        id: 'addiction',
        title: 'اعتیاد',
        items: [
          { id: 'substance_abuse', title: 'اعتیاد به مواد مخدر یا الکل' },
          { id: 'behavioral_addiction', title: 'اعتیاد به رفتارهای خاص (قمار، اینترنت)' }
        ]
      },
      {
        id: 'identity_issues',
        title: 'مشکلات هویتی',
        items: [
          { id: 'identity_confusion_adult', title: 'سردرگمی در هویت شخصی' },
          { id: 'identity_crisis', title: 'بحران‌های هویتی' }
        ]
      },
      {
        id: 'psychiatric_disorders',
        title: 'اختلالات روان‌پزشکی',
        items: [
          { id: 'ocd_bipolar_ptsd', title: 'OCD، اختلال دوقطبی، PTSD' }
        ]
      },
      {
        id: 'time_planning',
        title: 'مدیریت زمان و برنامه‌ریزی',
        items: [
          { id: 'organization', title: 'مشکلات در سازماندهی فعالیت‌ها' },
          { id: 'work_life_balance', title: 'حفظ تعادل بین کار و زندگی شخصی' }
        ]
      },
      {
        id: 'trauma',
        title: 'تجربیات آسیب‌زا',
        items: [
          { id: 'abuse', title: 'سوء استفاده یا آزار' },
          { id: 'traumatic_events', title: 'حوادث ناگوار' }
        ]
      },
      {
        id: 'suicide',
        title: 'خودکشی و افکار خودکشی',
        items: [
          { id: 'suicidal_thoughts', title: 'افکار خودکشی یا خودآزاری' },
          { id: 'deep_hopelessness', title: 'احساس ناامیدی عمیق' }
        ]
      },
      {
        id: 'personal_growth',
        title: 'نیاز به رشد شخصی',
        items: [
          { id: 'life_meaning', title: 'جستجوی اهداف و معنا در زندگی' },
          { id: 'skills_development', title: 'نیاز به توسعه مهارت‌های فردی و اجتماعی' }
        ]
      }
    ]
  },
  {
    id: 'couples',
    title: 'مشکلات زوج‌درمانی و روابط',
    subcategories: [
      {
        id: 'communication_couples',
        title: 'مشکلات ارتباطی',
        items: [
          { id: 'expressing_feelings', title: 'عدم توانایی در بیان احساسات' },
          { id: 'misunderstandings', title: 'سوءتفاهم‌ها و قضاوت‌های نادرست' },
          { id: 'not_listening', title: 'عدم شنیدن یا درک یکدیگر' }
        ]
      },
      {
        id: 'conflicts',
        title: 'اختلافات و تنش‌ها',
        items: [
          { id: 'frequent_arguments', title: 'مشاجره‌های مکرر' },
          { id: 'fundamental_disagreements', title: 'اختلاف نظرهای بنیادی (فرزندآوری، مسائل مالی)' },
          { id: 'family_tensions', title: 'تنش‌های ناشی از خانواده‌های دو طرف' }
        ]
      },
      {
        id: 'sexual_issues',
        title: 'مسائل جنسی',
        items: [
          { id: 'sexual_problems', title: 'مشکلات در برقراری رابطه جنسی' },
          { id: 'libido_mismatch', title: 'عدم تطابق در میل جنسی' },
          { id: 'coldness', title: 'احساس سردی یا بی‌علاقگی' }
        ]
      },
      {
        id: 'trust_betrayal',
        title: 'اعتماد و خیانت',
        items: [
          { id: 'lack_of_trust', title: 'احساس عدم اعتماد به شریک زندگی' },
          { id: 'infidelity', title: 'تجربه خیانت یا بی‌وفایی' }
        ]
      },
      {
        id: 'financial_issues',
        title: 'مسائل مالی',
        items: [
          { id: 'spending_disagreements', title: 'اختلاف نظر در هزینه‌ها و مدیریت مالی' },
          { id: 'financial_pressure', title: 'فشار مالی و تأثیر آن بر رابطه' }
        ]
      },
      {
        id: 'emotional_issues',
        title: 'مسائل عاطفی',
        items: [
          { id: 'expressing_love', title: 'ناتوانی در ابراز عشق و محبت' },
          { id: 'loneliness_in_relationship', title: 'احساس تنهایی یا طرد شدن در رابطه' }
        ]
      },
      {
        id: 'life_changes',
        title: 'تغییرات زندگی',
        items: [
          { id: 'adapting_changes', title: 'سازگاری با تغییرات (تولد فرزند، مهاجرت)' },
          { id: 'midlife_crisis', title: 'بحران‌های میانسالی یا پیری' }
        ]
      },
      {
        id: 'family_tensions',
        title: 'تنش‌های خانوادگی',
        items: [
          { id: 'in_laws', title: 'مشکلات با خانواده‌های همسر' },
          { id: 'parenting_tensions', title: 'تنش‌ها در تربیت فرزندان' }
        ]
      },
      {
        id: 'commitment',
        title: 'عدم تعهد',
        items: [
          { id: 'lack_commitment', title: 'احساس عدم تعهد از طرف شریک' }
        ]
      },
      {
        id: 'children_issues',
        title: 'مسائل مربوط به فرزندان',
        items: [
          { id: 'parenting_disagreements', title: 'اختلاف نظر در تربیت فرزندان' },
          { id: 'parenting_pressure', title: 'فشارهای مسئولیت‌های والدینی' }
        ]
      },
      {
        id: 'mental_emotional',
        title: 'مشکلات روانی یا عاطفی',
        items: [
          { id: 'mental_impact', title: 'تأثیر اختلالات روانی بر رابطه (افسردگی، اضطراب)' }
        ]
      },
      {
        id: 'power_imbalance',
        title: 'عدم توازن در قدرت',
        items: [
          { id: 'dominance', title: 'احساس سلطه یکی از طرفین' }
        ]
      },
      {
        id: 'cultural_religious',
        title: 'مشکلات فرهنگی یا مذهبی',
        items: [
          { id: 'cultural_differences', title: 'اختلافات فرهنگی یا مذهبی بین زوجین' }
        ]
      },
      {
        id: 'time_priorities',
        title: 'مشکلات مربوط به زمان و اولویت‌ها',
        items: [
          { id: 'work_life_imbalance', title: 'عدم تعادل بین کار و زندگی شخصی' }
        ]
      },
      {
        id: 'mutual_growth',
        title: 'نیاز به رشد شخصی و مشترک',
        items: [
          { id: 'shared_goals', title: 'جستجوی اهداف مشترک' },
          { id: 'life_skills', title: 'نیاز به توسعه مهارت‌های زندگی مشترک' }
        ]
      }
    ]
  },
  {
    id: 'premarriage',
    title: 'مشکلات پیش از ازدواج',
    subcategories: [
      {
        id: 'lack_knowledge',
        title: 'عدم شناخت کافی از شریک',
        items: [
          { id: 'insufficient_info', title: 'نداشتن اطلاعات کافی درباره شخصیت شریک' }
        ]
      },
      {
        id: 'cultural_religious_diff',
        title: 'اختلافات فرهنگی و مذهبی',
        items: [
          { id: 'cultural_differences_pre', title: 'تفاوت‌های فرهنگی یا مذهبی بین زوجین' }
        ]
      },
      {
        id: 'different_expectations',
        title: 'انتظارات و اهداف متفاوت',
        items: [
          { id: 'life_goals', title: 'اختلاف در اهداف زندگی (فرزندآوری، شغل)' }
        ]
      },
      {
        id: 'family_social_pressure',
        title: 'فشار خانواده و جامعه',
        items: [
          { id: 'family_pressure', title: 'فشار خانواده‌ها برای ازدواج' }
        ]
      },
      {
        id: 'financial_concerns',
        title: 'مسائل مالی',
        items: [
          { id: 'financial_worries', title: 'نگرانی در مورد وضعیت مالی زندگی مشترک' }
        ]
      },
      {
        id: 'communication_inability',
        title: 'عدم توانایی در برقراری ارتباط',
        items: [
          { id: 'expressing_emotions', title: 'مشکل در بیان احساسات' }
        ]
      },
      {
        id: 'commitment_concerns',
        title: 'نگرانی درباره تعهد',
        items: [
          { id: 'fear_commitment', title: 'ترس از تعهد و مسئولیت‌های ازدواج' }
        ]
      },
      {
        id: 'past_experiences',
        title: 'تجربیات گذشته',
        items: [
          { id: 'past_relationships', title: 'تأثیر روابط قبلی بر تصمیم‌گیری برای ازدواج' }
        ]
      },
      {
        id: 'family_children_concerns',
        title: 'مسائل مربوط به خانواده و فرزندان',
        items: [
          { id: 'parenting_concerns', title: 'نگرانی در مورد نحوه تربیت فرزندان' }
        ]
      },
      {
        id: 'emotional_readiness',
        title: 'عدم آمادگی عاطفی',
        items: [
          { id: 'not_ready', title: 'احساس عدم آمادگی برای رابطه جدی' }
        ]
      },
      {
        id: 'communication_problems_pre',
        title: 'مشکلات ارتباطی',
        items: [
          { id: 'listening_understanding', title: 'عدم توانایی در شنیدن و درک یکدیگر' }
        ]
      },
      {
        id: 'social_economic_pressure',
        title: 'فشارهای اجتماعی و اقتصادی',
        items: [
          { id: 'economic_concerns', title: 'نگرانی درباره وضعیت اقتصادی و تأثیر آن بر زندگی' }
        ]
      },
      {
        id: 'personality_differences',
        title: 'تفاوت‌های شخصیتی',
        items: [
          { id: 'lifestyle_differences', title: 'اختلافات در سبک‌های زندگی' }
        ]
      }
    ]
  }
];

interface FormBuilderDialogProps {
  open: boolean;
  onClose: () => void;
}

export function FormBuilderDialog({ open, onClose }: FormBuilderDialogProps) {
  const [step, setStep] = useState<'category' | 'items'>('category');
  const [selectedCategory, setSelectedCategory] = useState<FormCategory | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [openSubcategories, setOpenSubcategories] = useState<Set<string>>(new Set());

  const handleCategorySelect = (category: FormCategory) => {
    setSelectedCategory(category);
    setSelectedSubcategories(new Set());
    setSelectedItems(new Set());
    setOpenSubcategories(new Set());
    setStep('items');
  };

  const handleSubcategoryToggle = (subcategoryId: string) => {
    const subcategory = selectedCategory?.subcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return;

    const newSelectedSubcategories = new Set(selectedSubcategories);
    const newSelectedItems = new Set(selectedItems);

    if (selectedSubcategories.has(subcategoryId)) {
      // Uncheck subcategory and all its items
      newSelectedSubcategories.delete(subcategoryId);
      subcategory.items.forEach(item => newSelectedItems.delete(item.id));
    } else {
      // Check subcategory and all its items
      newSelectedSubcategories.add(subcategoryId);
      subcategory.items.forEach(item => newSelectedItems.add(item.id));
    }

    setSelectedSubcategories(newSelectedSubcategories);
    setSelectedItems(newSelectedItems);
  };

  const handleItemToggle = (subcategoryId: string, itemId: string) => {
    const subcategory = selectedCategory?.subcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return;

    const newSelectedItems = new Set(selectedItems);
    const newSelectedSubcategories = new Set(selectedSubcategories);

    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
      // If no items are selected, uncheck the subcategory
      const hasSelectedItems = subcategory.items.some(item => 
        item.id !== itemId && newSelectedItems.has(item.id)
      );
      if (!hasSelectedItems) {
        newSelectedSubcategories.delete(subcategoryId);
      }
    } else {
      newSelectedItems.add(itemId);
      // Check if all items are selected
      const allSelected = subcategory.items.every(item => 
        item.id === itemId || newSelectedItems.has(item.id)
      );
      if (allSelected) {
        newSelectedSubcategories.add(subcategoryId);
      }
    }

    setSelectedItems(newSelectedItems);
    setSelectedSubcategories(newSelectedSubcategories);
  };

  const toggleSubcategoryOpen = (subcategoryId: string) => {
    const newOpenSubcategories = new Set(openSubcategories);
    if (openSubcategories.has(subcategoryId)) {
      newOpenSubcategories.delete(subcategoryId);
    } else {
      newOpenSubcategories.add(subcategoryId);
    }
    setOpenSubcategories(newOpenSubcategories);
  };

  const handleBack = () => {
    setStep('category');
    setSelectedCategory(null);
    setSelectedSubcategories(new Set());
    setSelectedItems(new Set());
    setOpenSubcategories(new Set());
  };

  const handleComplete = () => {
    // Here you would save the form data
    console.log('Form created:', {
      category: selectedCategory?.title,
      subcategories: Array.from(selectedSubcategories),
      items: Array.from(selectedItems)
    });
    onClose();
    // Reset state
    setStep('category');
    setSelectedCategory(null);
    setSelectedSubcategories(new Set());
    setSelectedItems(new Set());
    setOpenSubcategories(new Set());
  };

  const handleCloseDialog = () => {
    onClose();
    // Reset state
    setTimeout(() => {
      setStep('category');
      setSelectedCategory(null);
      setSelectedSubcategories(new Set());
      setSelectedItems(new Set());
      setOpenSubcategories(new Set());
    }, 300);
  };

  const totalSelectedCount = selectedItems.size;
  const totalItemsCount = selectedCategory?.subcategories.reduce((sum, sub) => sum + sub.items.length, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            {step === 'category' ? 'انتخاب نوع فرم' : selectedCategory?.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {step === 'category' 
              ? 'انتخاب دسته‌بندی فرم برای ایجاد فرم ارزیابی جدید' 
              : 'انتخاب موارد مورد نظر از لیست برای ایجاد فرم سفارشی'}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(85vh-120px)] px-1">
          <AnimatePresence mode="wait">
            {step === 'category' ? (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <p className="text-muted-foreground mb-6">لطفاً نوع فرمی که می‌خواهید ایجاد کنید را انتخاب کنید:</p>
                {formCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className="w-full group p-4 rounded-xl bg-gradient-to-l from-primary/5 to-transparent hover:from-primary/10 hover:to-primary/5 border border-border hover:border-primary/30 transition-all duration-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                        <span className="text-foreground">{category.title}</span>
                        <span className="text-sm text-muted-foreground">
                          ({category.subcategories.length} دسته)
                        </span>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="items"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div>
                    <p className="text-muted-foreground mb-1">انتخاب شده:</p>
                    <p className="text-foreground">
                      {totalSelectedCount} مورد از {totalItemsCount}
                    </p>
                  </div>
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-primary/5 border border-border hover:border-primary/30 transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>بازگشت</span>
                  </button>
                </div>

                <p className="text-muted-foreground mb-4">دسته‌بندی‌ها و موارد مورد نظر خود را انتخاب کنید:</p>

                <div className="space-y-3">
                  {selectedCategory?.subcategories.map((subcategory, index) => {
                    const isSubcategorySelected = selectedSubcategories.has(subcategory.id);
                    const isOpen = openSubcategories.has(subcategory.id);
                    const selectedCount = subcategory.items.filter(item => selectedItems.has(item.id)).length;
                    
                    return (
                      <motion.div
                        key={subcategory.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border border-border rounded-xl overflow-hidden"
                      >
                        <div className={`p-4 transition-all duration-200 ${
                          isSubcategorySelected 
                            ? 'bg-primary/10 border-b border-primary/20' 
                            : 'bg-white hover:bg-primary/5'
                        }`}>
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isSubcategorySelected}
                              onCheckedChange={() => handleSubcategoryToggle(subcategory.id)}
                              className="w-5 h-5"
                            />
                            <button
                              onClick={() => toggleSubcategoryOpen(subcategory.id)}
                              className="flex-1 flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-foreground">{subcategory.title}</span>
                                {selectedCount > 0 && (
                                  <span className="text-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                    {selectedCount} از {subcategory.items.length}
                                  </span>
                                )}
                              </div>
                              <ChevronDown 
                                className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 pt-2 space-y-2 bg-muted/30">
                                {subcategory.items.map((item) => {
                                  const isItemSelected = selectedItems.has(item.id);
                                  return (
                                    <label
                                      key={item.id}
                                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                        isItemSelected
                                          ? 'bg-primary/5 border-primary/30'
                                          : 'bg-white hover:bg-primary/5 border-transparent hover:border-primary/20'
                                      }`}
                                    >
                                      <Checkbox
                                        checked={isItemSelected}
                                        onCheckedChange={() => handleItemToggle(subcategory.id, item.id)}
                                        className="w-4 h-4"
                                      />
                                      <span className="text-sm text-foreground flex-1">{item.title}</span>
                                      {isItemSelected && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                        >
                                          <Check className="w-4 h-4 text-primary" />
                                        </motion.div>
                                      )}
                                    </label>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step === 'items' && (
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-muted border border-border transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              <span>بازگشت</span>
            </button>
            <button
              onClick={handleComplete}
              disabled={totalSelectedCount === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-primary to-primary/80 text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <span>ایجاد فرم ({totalSelectedCount} مورد)</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
