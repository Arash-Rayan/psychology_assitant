import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Calendar, Clock, Smile, Target, BookOpen, Home, Save, ChevronRight, ChevronLeft, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

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

interface AddSessionNoteDialogProps {
  open: boolean;
  onClose: () => void;
  patientName: string;
  sessionNumber: number;
}

export function AddSessionNoteDialog({ open, onClose, patientName, sessionNumber }: AddSessionNoteDialogProps) {
  const [step, setStep] = useState<'category' | 'form'>('category');
  const [selectedCategory, setSelectedCategory] = useState<FormCategory | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [openSubcategories, setOpenSubcategories] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '45',
    mood: '',
    mainTopics: '',
    chiefComplaint: '',
    historyBackground: '',
    sessionObjective: '',
    summary: '',
    formulation: '',
    treatmentPlan: '',
    homework: '',
    nextSessionGoals: ''
  });

  const handleCategorySelect = (category: FormCategory) => {
    setSelectedCategory(category);
    setSelectedSubcategories(new Set());
    setSelectedItems(new Set());
    setOpenSubcategories(new Set());
  };

  const handleSubcategoryToggle = (subcategoryId: string) => {
    const subcategory = selectedCategory?.subcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return;

    const newSelectedSubcategories = new Set(selectedSubcategories);
    const newSelectedItems = new Set(selectedItems);

    if (selectedSubcategories.has(subcategoryId)) {
      newSelectedSubcategories.delete(subcategoryId);
      subcategory.items.forEach(item => newSelectedItems.delete(item.id));
    } else {
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
      const hasSelectedItems = subcategory.items.some(item => 
        item.id !== itemId && newSelectedItems.has(item.id)
      );
      if (!hasSelectedItems) {
        newSelectedSubcategories.delete(subcategoryId);
      }
    } else {
      newSelectedItems.add(itemId);
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

  const handleContinueToForm = () => {
    if (selectedItems.size === 0) {
      toast.error('لطفاً حداقل یک مورد را انتخاب کنید');
      return;
    }
    setStep('form');
  };

  const handleBackToCategory = () => {
    setStep('category');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mood || !formData.summary) {
      toast.error('لطفاً حال عمومی و خلاصه جلسه را وارد کنید');
      return;
    }

    console.log('New session note:', {
      patientName,
      sessionNumber,
      category: selectedCategory?.title,
      selectedTopics: Array.from(selectedItems),
      ...formData
    });

    toast.success('یادداشت جلسه با موفقیت ثبت شد');
    
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    onClose();
    setTimeout(() => {
      setStep('category');
      setSelectedCategory(null);
      setSelectedSubcategories(new Set());
      setSelectedItems(new Set());
      setOpenSubcategories(new Set());
      setFormData({
        date: new Date().toISOString().split('T')[0],
        duration: '45',
        mood: '',
        mainTopics: '',
        chiefComplaint: '',
        historyBackground: '',
        sessionObjective: '',
        summary: '',
        formulation: '',
        treatmentPlan: '',
        homework: '',
        nextSessionGoals: ''
      });
    }, 300);
  };

  const totalSelectedCount = selectedItems.size;
  const totalItemsCount = selectedCategory?.subcategories.reduce((sum, sub) => sum + sub.items.length, 0) || 0;

  const moodOptions = [
    { value: 'آرام', icon: '😌', color: 'from-[#6fcf97] to-[#5fb587]' },
    { value: 'خوشحال', icon: '😊', color: 'from-[#56CCF2] to-[#2F80ED]' },
    { value: 'مضطرب', icon: '😰', color: 'from-[#f2c94c] to-[#e0b73c]' },
    { value: 'غمگین', icon: '😔', color: 'from-[#BB6BD9] to-[#9B51E0]' },
    { value: 'امیدوار', icon: '🙂', color: 'from-[#8B5CF6] to-[#7C3AED]' },
    { value: 'عصبانی', icon: '😠', color: 'from-[#eb5757] to-[#d84747]' }
  ];

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f2c94c] to-[#e0b73c] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            {step === 'category' 
              ? (selectedCategory ? selectedCategory.title : 'انتخاب دسته‌بندی موضوعات')
              : 'افزودن یادداشت جلسه'
            }
          </DialogTitle>
          <DialogDescription className="sr-only">
            {step === 'category' 
              ? 'انتخاب موضوعات مورد بحث در جلسه درمانی'
              : `فرم ثبت یادداشت جلسه درمانی برای ${patientName}`
            }
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'category' ? (
            <motion.div
              key="category-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Patient Info */}
              <div className="p-4 rounded-xl bg-gradient-to-l from-primary/5 to-transparent border border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">مراجع</p>
                    <p className="text-foreground">{patientName}</p>
                  </div>
                  <div className="w-px h-8 bg-border mx-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">شماره جلسه</p>
                    <p className="text-foreground">#{sessionNumber}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-280px)] px-1">
                {!selectedCategory ? (
                  <div className="space-y-3">
                    <p className="text-muted-foreground mb-4">لطفاً دسته‌بندی موضوعات جلسه را انتخاب کنید:</p>
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <div>
                        <p className="text-muted-foreground mb-1">انتخاب شده:</p>
                        <p className="text-foreground">
                          {totalSelectedCount} مورد از {totalItemsCount}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-primary/5 border border-border hover:border-primary/30 transition-all duration-200"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>بازگشت</span>
                      </button>
                    </div>

                    <p className="text-muted-foreground mb-4">موضوعات مورد بحث در جلسه را انتخاب کنید:</p>

                    <div className="space-y-3">
                      {selectedCategory.subcategories.map((subcategory, index) => {
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
                  </div>
                )}
              </div>

              {selectedCategory && (
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-muted border border-border transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>بازگشت</span>
                  </button>
                  <button
                    onClick={handleContinueToForm}
                    disabled={totalSelectedCount === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-[#f2c94c] to-[#e0b73c] text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    <span>ادامه ({totalSelectedCount} مورد)</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="session-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="overflow-y-auto max-h-[calc(90vh-220px)] px-1 space-y-6">
                {/* Patient Info */}
                <div className="p-4 rounded-xl bg-gradient-to-l from-primary/5 to-transparent border border-primary/20">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">مراجع</p>
                        <p className="text-foreground">{patientName}</p>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <p className="text-sm text-muted-foreground">شماره جلسه</p>
                      <p className="text-foreground">#{sessionNumber}</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <p className="text-sm text-muted-foreground">موضوعات انتخابی</p>
                      <p className="text-foreground">{totalSelectedCount} مورد</p>
                    </div>
                  </div>
                </div>

                {/* Date and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label className="flex items-center gap-2 mb-2 text-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      تاریخ جلسه
                    </Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full"
                      dir="ltr"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Label className="flex items-center gap-2 mb-2 text-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      مدت زمان (دقیقه)
                    </Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="45"
                      className="w-full"
                      dir="rtl"
                    />
                  </motion.div>
                </div>

                {/* Mood Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="flex items-center gap-2 mb-3 text-foreground">
                    <Smile className="w-4 h-4 text-primary" />
                    حال عمومی مراجع <span className="text-[#eb5757]">*</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {moodOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, mood: option.value })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          formData.mood === option.value
                            ? `bg-gradient-to-br ${option.color} border-transparent text-white shadow-lg`
                            : 'bg-white border-border hover:border-primary/30 text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <span className={formData.mood === option.value ? 'text-white' : 'text-foreground'}>
                            {option.value}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Main Topics */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Label className="flex items-center gap-2 mb-2 text-foreground">
                    <Target className="w-4 h-4 text-primary" />
                    موضوعات اضافی (اختیاری)
                  </Label>
                  <Input
                    value={formData.mainTopics}
                    onChange={(e) => setFormData({ ...formData, mainTopics: e.target.value })}
                    placeholder="موضوعات دیگری که در جلسه مطرح شد..."
                    className="w-full"
                    dir="rtl"
                  />
                </motion.div>

                {/* Clinical report structure */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl border border-border/60 bg-muted/10 p-4"
                  dir="rtl"
                >
                  <div className="mb-4 pb-3 border-b border-border/50">
                    <p className="text-xs font-semibold text-foreground text-right">ساختار گزارش بالینی جلسه</p>
                    <p className="text-[11px] text-muted-foreground/75 mt-1 text-right leading-snug">
                      در عرض بزرگ در دو ستون؛ راهنماها کوتاه هستند.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="rounded-lg border border-border/50 bg-background/80 p-3 space-y-1">
                        <Label className="text-xs font-medium text-foreground block text-right">۱. شکایت اصلی مراجع</Label>
                        <p className="text-[11px] text-muted-foreground/70 text-right leading-snug">علت مراجعه؛ کوتاه.</p>
                        <Textarea
                          value={formData.chiefComplaint}
                          onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                          placeholder="..."
                          className="min-h-[72px] text-sm w-full resize-y rounded-md border-border/50"
                          dir="rtl"
                        />
                      </div>
                      <div className="rounded-lg border border-border/50 bg-background/80 p-3 space-y-1">
                        <Label className="text-xs font-medium text-foreground block text-right">۲. پیشینه و سابقه</Label>
                        <p className="text-[11px] text-muted-foreground/70 text-right leading-snug">آغاز، زمینه، روند.</p>
                        <Textarea
                          value={formData.historyBackground}
                          onChange={(e) => setFormData({ ...formData, historyBackground: e.target.value })}
                          placeholder="..."
                          className="min-h-[72px] text-sm w-full resize-y rounded-md border-border/50"
                          dir="rtl"
                        />
                      </div>
                      <div className="rounded-lg border border-border/50 bg-background/80 p-3 space-y-1">
                        <Label className="text-xs font-medium text-foreground block text-right">۳. هدف جلسه فعلی</Label>
                        <p className="text-[11px] text-muted-foreground/70 text-right leading-snug">دستور این جلسه.</p>
                        <Textarea
                          value={formData.sessionObjective}
                          onChange={(e) => setFormData({ ...formData, sessionObjective: e.target.value })}
                          placeholder="..."
                          className="min-h-[72px] text-sm w-full resize-y rounded-md border-border/50"
                          dir="rtl"
                        />
                      </div>
                      <div className="rounded-lg border border-border/50 bg-background/80 p-3 space-y-1">
                        <Label className="flex items-center justify-end gap-1.5 text-xs font-medium text-foreground">
                          <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                          ۴. خلاصه جلسه
                          <span className="text-[#eb5757]">*</span>
                        </Label>
                        <p className="text-[11px] text-muted-foreground/70 text-right leading-snug">محتوای اصلی جلسه.</p>
                        <Textarea
                          value={formData.summary}
                          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                          placeholder="..."
                          className="min-h-[100px] text-sm w-full resize-y rounded-md border-border/50"
                          dir="rtl"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg border border-border/50 bg-background/80 p-3 space-y-1">
                        <Label className="text-xs font-medium text-foreground block text-right">۵. فرمولاسیون</Label>
                        <p className="text-[11px] text-muted-foreground/70 text-right leading-snug">تحلیل و فرضیه‌ها.</p>
                        <Textarea
                          value={formData.formulation}
                          onChange={(e) => setFormData({ ...formData, formulation: e.target.value })}
                          placeholder="..."
                          className="min-h-[72px] text-sm w-full resize-y rounded-md border-border/50"
                          dir="rtl"
                        />
                      </div>
                      <div className="rounded-lg border border-border/50 bg-background/80 p-3 space-y-1">
                        <Label className="text-xs font-medium text-foreground block text-right">۶. طرح درمان</Label>
                        <p className="text-[11px] text-muted-foreground/70 text-right leading-snug">مسیر مداخله.</p>
                        <Textarea
                          value={formData.treatmentPlan}
                          onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                          placeholder="..."
                          className="min-h-[72px] text-sm w-full resize-y rounded-md border-border/50"
                          dir="rtl"
                        />
                      </div>
                      <div className="rounded-lg border border-border/50 bg-background/80 p-3 space-y-1">
                        <Label className="flex items-center justify-end gap-1.5 text-xs font-medium text-foreground">
                          <Home className="w-3.5 h-3.5 text-primary shrink-0" />
                          ۷. تکالیف خانگی
                        </Label>
                        <p className="text-[11px] text-muted-foreground/70 text-right leading-snug">تا جلسه بعد.</p>
                        <Textarea
                          value={formData.homework}
                          onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                          placeholder="..."
                          className="min-h-[80px] text-sm w-full resize-y rounded-md border-border/50"
                          dir="rtl"
                        />
                      </div>
                      <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-3 space-y-1">
                        <Label className="flex items-center justify-end gap-1.5 text-xs font-medium text-foreground">
                          <Target className="w-3.5 h-3.5 text-primary shrink-0" />
                          اهداف جلسه بعد
                          <span className="text-muted-foreground/70 font-normal">(اختیاری)</span>
                        </Label>
                        <Textarea
                          value={formData.nextSessionGoals}
                          onChange={(e) => setFormData({ ...formData, nextSessionGoals: e.target.value })}
                          placeholder="..."
                          className="min-h-[72px] text-sm w-full resize-y rounded-md border-border/50"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleBackToCategory}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-muted border border-border transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>بازگشت</span>
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseDialog}
                    className="px-6 py-3 rounded-xl bg-white hover:bg-muted border border-border transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-[#f2c94c] to-[#e0b73c] text-white hover:shadow-lg transition-all duration-300"
                  >
                    <Save className="w-4 h-4" />
                    <span>ذخیره یادداشت</span>
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
