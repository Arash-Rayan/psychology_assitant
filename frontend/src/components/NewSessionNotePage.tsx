import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowRight, Check, ChevronDown, ChevronLeft, Mic, Upload, FileImage, Save, Type, Volume2, Image as ImageIcon, FileText } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { cn } from './ui/utils';
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
          { id: 'career_advancement', title: 'مشکلات در پیشرفت شغلی' }
        ]
      },
      {
        id: 'academic_issues',
        title: 'مشکلات تحصیلی',
        items: [
          { id: 'academic_decline_adult', title: 'افت تحصیلی' },
          { id: 'major_selection', title: 'مشکلات انتخاب رشته' },
          { id: 'learning_problems', title: 'مشکلات یادگیری' }
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
          { id: 'anxiety_general', title: 'اضطراب و نگرانی' },
          { id: 'depression_general', title: 'افسردگی' },
          { id: 'stress', title: 'استرس و فشار روانی' }
        ]
      },
      {
        id: 'emotional_problems',
        title: 'مشکلات عاطفی',
        items: [
          { id: 'emotion_management', title: 'ناتوانی در مدیریت احساسات' },
          { id: 'anger_hopelessness', title: 'احساس خشم یا ناامیدی' }
        ]
      }
    ]
  }
];

function ClinicalField({
  id,
  n,
  title,
  hint,
  placeholder,
  value,
  onChange,
  tall,
  optional,
}: {
  id: string;
  n: string;
  title: string;
  hint: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  tall?: boolean;
  optional?: boolean;
}) {
  const [open, setOpen] = useState(() => value.trim().length > 0);
  const hintText = hint.trim() !== '' ? hint : optional ? 'در صورت نیاز، برنامه جلسه بعد را بنویسید.' : '';

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          'overflow-hidden rounded-xl border transition-all duration-150',
          optional
            ? 'border-dashed border-border/50 bg-white/60'
            : open
              ? 'border-primary/30 bg-white shadow-[0_4px_16px_-4px_rgba(60,199,217,0.15)]'
              : 'border-border/40 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)] hover:border-primary/25 hover:shadow-[0_4px_16px_-4px_rgba(60,199,217,0.12)]'
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            dir="rtl"
            className={cn(
                  'flex w-full select-none items-center gap-3 px-5 py-4',
              'transition-colors hover:bg-muted/10',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/20'
            )}
          >
            {/* right side: number badge */}
            {!optional ? (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold tabular-nums text-primary">
                {n}
              </span>
            ) : null}

            {/* middle: title (RTL text, fills space, right-aligned) */}
            <span className="min-w-0 flex-1 truncate text-right text-[15px] font-semibold leading-snug text-foreground">
              {title}
            </span>

            {/* optional badge */}
            {optional && (
              <span className="shrink-0 rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
                اختیاری
              </span>
            )}

            {/* preview when closed */}
            {!open && value.trim() !== '' && (
              <span className="max-w-[180px] shrink truncate text-[11px] text-muted-foreground/70 sm:max-w-[240px]">
                {value.trim()}
              </span>
            )}

            {/* chevron */}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
              <ChevronDown
                className={cn('h-4 w-4 transition-transform duration-200', open && '-rotate-180')}
              />
            </span>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <div className="border-t border-border/30 px-4 pb-4 pt-3">
            <Textarea
              id={id}
              aria-label={title}
              placeholder={placeholder}
              dir="rtl"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={tall ? 6 : 4}
              className={cn(
                '!w-full !resize-y !rounded-lg !border !border-border/50 !bg-muted/20 !px-3.5 !py-3 !text-sm !leading-7 !text-foreground !shadow-none !outline-none !ring-0',
                'placeholder:!text-right placeholder:!text-muted-foreground/45',
                'focus-visible:!border-primary/40 focus-visible:!bg-white focus-visible:!ring-0 focus-visible:!outline-none focus-visible:!shadow-[0_0_0_3px_rgba(60,199,217,0.15)]',
                tall ? '!min-h-[140px]' : '!min-h-[108px]'
              )}
            />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface NewSessionNotePageProps {
  patientName?: string;
  onClose?: () => void;
}

export default function NewSessionNotePage({ patientName, onClose }: NewSessionNotePageProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [basicInfoOpen, setBasicInfoOpen] = useState(false);
  const [inputMethod, setInputMethod] = useState<'type' | 'voice' | 'image'>('type');
  const [isRecording, setIsRecording] = useState(false);

  const [formData, setFormData] = useState({
    patientName: patientName ?? '',
    age: '',
    gender: '',
    date: '',
    duration: '',
    mood: '',
    chiefComplaint: '',
    historyBackground: '',
    sessionObjective: '',
    summary: '',
    formulation: '',
    treatmentPlan: '',
    homework: '',
    nextSessionGoals: ''
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev =>
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('شروع ضبط صدا...');
    } else {
      toast.success('ضبط متوقف شد');
    }
  };

  const handleImageUpload = () => {
    toast.success('تصویر دست‌نوشته بارگذاری شد');
  };

  const handleBack = () => {
    if (onClose) onClose();
    else router.back();
  };

  const handleSave = () => {
    toast.success('یادداشت جلسه با موفقیت ذخیره شد');
    handleBack();
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-b from-[#F5F3FF] to-white" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-foreground">افزودن یادداشت جلسه جدید</h1>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره یادداشت</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {/* Top row: categories + basic info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">

          {/* ── Categories ── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
            <div className={cn(
              'overflow-hidden rounded-2xl border bg-white shadow-[0_4px_24px_-8px_rgba(15,23,42,0.10)] transition-all duration-150',
              categoriesOpen ? 'border-primary/25' : 'border-border/40'
            )}>
              {/* header */}
              <CollapsibleTrigger asChild>
              <button type="button" className="flex w-full items-center gap-3 border-b border-border/30 bg-gradient-to-l from-primary/[0.06] to-transparent px-5 py-4 sm:px-6 cursor-pointer select-none" dir="rtl">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200', categoriesOpen ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary/70')}>
                  <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', categoriesOpen && '-rotate-180')} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1 text-right">
                  <h2 className="text-base font-semibold text-foreground">دسته‌بندی موضوعات جلسه</h2>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">موضوعات مطرح‌شده را علامت بزنید</p>
                </div>
              </button>
              </CollapsibleTrigger>

              {/* body */}
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
              <div className="px-3 py-4 sm:px-4 sm:py-4">
                <div className="space-y-2" dir="rtl">
                  {formCategories.map((category) => (
                    <div key={category.id} className={cn(
                      'overflow-hidden rounded-xl border transition-all duration-150',
                      expandedCategories.includes(category.id)
                        ? 'border-primary/25 shadow-[0_2px_10px_-4px_rgba(60,199,217,0.15)]'
                        : 'border-border/40 hover:border-primary/20'
                    )}>
                      <div
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                          expandedCategories.includes(category.id)
                            ? 'bg-primary/[0.05]'
                            : 'hover:bg-muted/15'
                        )}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <ChevronDown
                          className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                            expandedCategories.includes(category.id) && '-rotate-180'
                          )}
                        />
                        <span className="min-w-0 flex-1 text-right text-sm font-medium text-foreground">{category.title}</span>
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategorySelect(category.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0"
                        />
                      </div>

                      {expandedCategories.includes(category.id) && (
                        <div className="border-t border-border/30 px-3 py-2 space-y-1 bg-muted/[0.07]">
                          {category.subcategories.map((subcategory) => (
                            <div key={subcategory.id}>
                              <div
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/80 transition-colors"
                                onClick={() => toggleSubcategory(subcategory.id)}
                              >
                                <ChevronLeft
                                  className={cn('h-3.5 w-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-150',
                                    expandedSubcategories.includes(subcategory.id) && '-rotate-90'
                                  )}
                                />
                                <span className="min-w-0 flex-1 text-right text-[13px] text-foreground/90">{subcategory.title}</span>
                                <Checkbox
                                  checked={selectedSubcategories.includes(subcategory.id)}
                                  onCheckedChange={() => handleSubcategorySelect(subcategory.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="shrink-0 h-4 w-4"
                                />
                              </div>

                              {expandedSubcategories.includes(subcategory.id) && (
                                <div className="mr-8 mt-0.5 mb-1 space-y-0.5">
                                  {subcategory.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/70 transition-colors"
                                      onClick={() => handleItemSelect(item.id)}
                                    >
                                      <Checkbox
                                        checked={selectedItems.includes(item.id)}
                                        onCheckedChange={() => handleItemSelect(item.id)}
                                        className="shrink-0 h-3.5 w-3.5"
                                      />
                                      <span className="min-w-0 flex-1 text-right text-xs text-muted-foreground">{item.title}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              </CollapsibleContent>
            </div>
            </Collapsible>
          </div>

          {/* ── Basic session info ── */}
          <div className="lg:col-span-7 xl:col-span-8">
            <Collapsible open={basicInfoOpen} onOpenChange={setBasicInfoOpen}>
            <div className={cn(
              'overflow-hidden rounded-2xl border bg-white shadow-[0_4px_24px_-8px_rgba(15,23,42,0.10)] transition-all duration-150',
              basicInfoOpen ? 'border-primary/25' : 'border-border/40'
            )}>
              {/* header */}
              <CollapsibleTrigger asChild>
              <button type="button" className="flex w-full items-center gap-3 border-b border-border/30 bg-gradient-to-l from-primary/[0.06] to-transparent px-5 py-4 sm:px-6 cursor-pointer select-none" dir="rtl">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200', basicInfoOpen ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary/70')}>
                  <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', basicInfoOpen && '-rotate-180')} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1 text-right">
                  <h2 className="text-base font-semibold text-foreground">اطلاعات اولیه جلسه</h2>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">مشخصات مراجع و این جلسه</p>
                </div>
              </button>
              </CollapsibleTrigger>

              {/* body */}
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
              <div className="px-5 py-5 sm:px-6 sm:py-6" dir="rtl">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="patientName" className="block text-right text-[13px] font-medium text-foreground/80">نام و نام خانوادگی مراجع</Label>
                      <Input
                        id="patientName"
                        type="text"
                        placeholder="مثال: علی رضایی"
                        dir="rtl"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className="h-10 rounded-xl border-border/50 bg-muted/20 text-right text-sm placeholder:text-muted-foreground/50 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_rgba(60,199,217,0.15)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="block text-right text-[13px] font-medium text-foreground/80">سن</Label>
                      <Input
                        id="age"
                        type="number"
                        min={0}
                        max={120}
                        placeholder="مثال: ۳۲"
                        dir="rtl"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="h-10 rounded-xl border-border/50 bg-muted/20 text-right text-sm placeholder:text-muted-foreground/50 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_rgba(60,199,217,0.15)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="block text-right text-[13px] font-medium text-foreground/80">جنسیت</Label>
                      <select
                        id="gender"
                        dir="rtl"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="h-10 w-full rounded-xl border border-border/50 bg-muted/20 px-3 text-right text-sm text-foreground outline-none transition-all focus:border-primary/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(60,199,217,0.15)]"
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="female">زن</option>
                        <option value="male">مرد</option>
                        <option value="other">سایر</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date" className="block text-right text-[13px] font-medium text-foreground/80">تاریخ جلسه</Label>
                      <Input
                        id="date"
                        type="text"
                        placeholder="مثال: ۱۴۰۴/۸/۱۵"
                        dir="rtl"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="h-10 rounded-xl border-border/50 bg-muted/20 text-right text-sm placeholder:text-muted-foreground/50 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_rgba(60,199,217,0.15)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="block text-right text-[13px] font-medium text-foreground/80">مدت جلسه</Label>
                      <Input
                        id="duration"
                        type="text"
                        placeholder="مثال: ۴۵ دقیقه"
                        dir="rtl"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="h-10 rounded-xl border-border/50 bg-muted/20 text-right text-sm placeholder:text-muted-foreground/50 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_rgba(60,199,217,0.15)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mood" className="block text-right text-[13px] font-medium text-foreground/80">حال عمومی مراجع</Label>
                      <Input
                        id="mood"
                        type="text"
                        placeholder="مثال: آرام، مضطرب، خوشحال"
                        dir="rtl"
                        value={formData.mood}
                        onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                        className="h-10 rounded-xl border-border/50 bg-muted/20 text-right text-sm placeholder:text-muted-foreground/50 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_rgba(60,199,217,0.15)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              </CollapsibleContent>
            </div>
            </Collapsible>
          </div>
          </div>

          {/* Clinical report */}
          <section
            className="overflow-hidden rounded-2xl border border-border/40 bg-white shadow-[0_4px_24px_-8px_rgba(15,23,42,0.10)]"
            dir="rtl"
          >
            {/* section header */}
            <div className="flex items-center gap-3 border-b border-border/30 bg-gradient-to-l from-primary/[0.06] to-transparent px-5 py-4 sm:px-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-4 w-4" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <h2 className="text-base font-semibold text-foreground">گزارش بالینی جلسه</h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">هر بخش را باز کنید و پر کنید.</p>
              </div>
            </div>

            <div className="px-3 py-4 sm:px-5 sm:py-5">
              <div className="mx-auto flex max-w-3xl flex-col gap-3">
                <ClinicalField
                  id="chiefComplaint"
                  n="۱"
                  title="شکایت اصلی مراجع"
                  hint="علت مراجعه به‌صورت خلاصه."
                  placeholder="مثال: اضطراب اجتماعی، بی‌خوابی، ..."
                  value={formData.chiefComplaint}
                  onChange={(v) => setFormData({ ...formData, chiefComplaint: v })}
                />
                <ClinicalField
                  id="historyBackground"
                  n="۲"
                  title="پیشینه و سابقه مشکل"
                  hint="شروع، زمینه و روند."
                  placeholder="زمان شروع، سوابق، خانواده..."
                  value={formData.historyBackground}
                  onChange={(v) => setFormData({ ...formData, historyBackground: v })}
                />
                <ClinicalField
                  id="sessionObjective"
                  n="۳"
                  title="دستور و هدف جلسه فعلی"
                  hint="هدف همین جلسه از دید شما."
                  placeholder="مثال: آموزش تنفس، کار روی باورها..."
                  value={formData.sessionObjective}
                  onChange={(v) => setFormData({ ...formData, sessionObjective: v })}
                />
                <ClinicalField
                  id="summary"
                  n="۴"
                  title="خلاصه جلسه"
                  hint="آنچه در جلسه انجام و گفته شد."
                  placeholder="رویدادها، مباحث اصلی، مشاهدات..."
                  value={formData.summary}
                  onChange={(v) => setFormData({ ...formData, summary: v })}
                  tall
                />
                <ClinicalField
                  id="formulation"
                  n="۵"
                  title="فرمولاسیون و تحلیل بالینی"
                  hint="برداشت بالینی، الگوها، فرضیه‌ها."
                  placeholder="تحلیل شناختی–عاطفی، طرحواره..."
                  value={formData.formulation}
                  onChange={(v) => setFormData({ ...formData, formulation: v })}
                />
                <ClinicalField
                  id="treatmentPlan"
                  n="۶"
                  title="طرح درمان"
                  hint="مسیر و تمرکز مداخله."
                  placeholder="رویکرد، گام بعدی، اولویت‌ها..."
                  value={formData.treatmentPlan}
                  onChange={(v) => setFormData({ ...formData, treatmentPlan: v })}
                />
                <ClinicalField
                  id="homework"
                  n="۷"
                  title="تکالیف و تمرین‌های خانگی"
                  hint="تا جلسه بعد."
                  placeholder="تمرین یا تکلیف محول‌شده..."
                  value={formData.homework}
                  onChange={(v) => setFormData({ ...formData, homework: v })}
                />
                <ClinicalField
                  id="nextSessionGoals"
                  n=""
                  title="اهداف جلسه بعد"
                  hint=""
                  placeholder="موضوعات یا اهداف جلسه آینده..."
                  value={formData.nextSessionGoals}
                  onChange={(v) => setFormData({ ...formData, nextSessionGoals: v })}
                  optional
                />
              </div>
            </div>
          </section>

          {/* Input method */}
          <section className="rounded-2xl border border-border/50 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-6">
              <div className="mx-auto max-w-3xl text-right" dir="rtl">
                <h2 className="text-base font-semibold text-foreground">روش ثبت مکمل</h2>
                <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                  متن اصلی در بلوک بالا؛ اینجا صدا یا تصویر در صورت نیاز.
                </p>
              </div>

              <div
                className="mx-auto mt-4 flex max-w-3xl flex-col gap-2 rounded-xl border border-border/45 bg-muted/30 p-1.5 sm:flex-row sm:gap-1.5"
                dir="rtl"
                role="tablist"
                aria-label="روش ثبت"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={inputMethod === 'type'}
                  onClick={() => setInputMethod('type')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm transition-all sm:py-2.5',
                    inputMethod === 'type'
                      ? 'bg-white font-medium text-primary shadow-sm ring-1 ring-border/50'
                      : 'text-muted-foreground hover:bg-white/60 hover:text-foreground'
                  )}
                >
                  <Type className="h-4 w-4 shrink-0 opacity-80" />
                  تایپ
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={inputMethod === 'voice'}
                  onClick={() => setInputMethod('voice')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm transition-all sm:py-2.5',
                    inputMethod === 'voice'
                      ? 'bg-white font-medium text-primary shadow-sm ring-1 ring-border/50'
                      : 'text-muted-foreground hover:bg-white/60 hover:text-foreground'
                  )}
                >
                  <Volume2 className="h-4 w-4 shrink-0 opacity-80" />
                  صدا
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={inputMethod === 'image'}
                  onClick={() => setInputMethod('image')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm transition-all sm:py-2.5',
                    inputMethod === 'image'
                      ? 'bg-white font-medium text-primary shadow-sm ring-1 ring-border/50'
                      : 'text-muted-foreground hover:bg-white/60 hover:text-foreground'
                  )}
                >
                  <ImageIcon className="h-4 w-4 shrink-0 opacity-80" />
                  تصویر
                </button>
              </div>

              {inputMethod === 'type' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto mt-4 max-w-3xl rounded-lg bg-muted/25 px-3 py-2.5 text-right"
                  dir="rtl"
                >
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    فیلدهای بالا برای ثبت متن کافی‌اند؛ این بخش برای ضبط یا اسکن اختیاری است.
                  </p>
                </motion.div>
              )}

              {/* Voice Recording Method */}
              {inputMethod === 'voice' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto mt-4 max-w-3xl space-y-6"
                  dir="rtl"
                >
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/25 bg-gradient-to-b from-primary/[0.04] to-transparent py-10 px-5 sm:py-12 sm:px-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all ${
                      isRecording 
                        ? 'bg-[#eb5757] animate-pulse' 
                        : 'bg-primary'
                    }`}>
                      <Mic className="w-10 h-10 text-white" />
                    </div>
                    
                    <p className="text-lg text-foreground mb-2 text-center">
                      {isRecording ? 'در حال ضبط...' : 'آماده برای ضبط صدا'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-6 text-center">
                      {isRecording 
                        ? 'صدای شما به متن تبدیل می‌شود' 
                        : 'برای شروع ضبط، دکمه زیر را بزنید'}
                    </p>

                    <button
                      onClick={handleRecordToggle}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all ${
                        isRecording
                          ? 'bg-[#eb5757] hover:bg-[#d94848] text-white'
                          : 'bg-primary hover:bg-primary-hover text-primary-foreground'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <span className="w-3 h-3 rounded-sm bg-white"></span>
                          <span>توقف ضبط</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          <span>شروع ضبط</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isRecording && (
                    <div className="p-4 bg-accent/30 rounded-xl border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-2 text-right">متن تبدیل شده:</p>
                      <p className="text-foreground text-right leading-relaxed">
                        مراجع در این جلسه پیشرفت خوبی در مدیریت احساسات خود نشان داد. مشکلات مربوط به محیط کار به تفصیل بررسی شد...
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Image Upload Method */}
              {inputMethod === 'image' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto mt-4 max-w-3xl space-y-4"
                  dir="rtl"
                >
                  <div 
                    onClick={handleImageUpload}
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-10 px-5 transition-all cursor-pointer hover:border-primary/35 hover:bg-primary/[0.03] sm:py-12 sm:px-6 group"
                  >
                    <div className="w-20 h-20 rounded-full bg-secondary/30 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-all">
                      <Upload className="w-10 h-10 text-secondary group-hover:text-primary transition-colors" />
                    </div>
                    
                    <p className="text-lg text-foreground mb-2 text-center">
                      بارگذاری تصویر یادداشت دست‌نوشته
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      عکس یادداشت‌های خود را اینجا آپلود کنید
                    </p>

                    <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-border group-hover:border-primary transition-colors">
                      <FileImage className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">انتخاب فایل</span>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/30 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground text-right">
                      💡 نکته: تصاویر بارگذاری شده به صورت خودکار به متن تبدیل خواهند شد
                    </p>
                  </div>
                </motion.div>
              )}
          </section>
        </div>
      </div>
    </div>
  );
}
