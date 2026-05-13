import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  Mic,
  Upload,
  FileImage,
  Save,
  Type,
  Volume2,
  Image as ImageIcon,
  Pause,
  Play,
} from 'lucide-react';
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

/** Shared styles for accordion headers (collapsed + open). */
function sessionPanelTriggerClasses(open: boolean) {
  return cn(
    'flex min-h-[5.75rem] w-full cursor-pointer select-none items-center gap-5 bg-gradient-to-l from-slate-50 to-white px-7 py-6 text-right transition-colors sm:min-h-[6.25rem] sm:gap-6 sm:px-9 sm:py-7',
    'hover:from-slate-50 hover:to-slate-50/80',
    open ? 'border-b border-slate-200/80' : 'border-b border-transparent',
  );
}

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
          'group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-shadow duration-200',
          optional
            ? 'border-dashed border-slate-300/80 bg-slate-50/40'
            : open
              ? 'border-primary/30 shadow-md ring-1 ring-primary/10'
              : 'hover:border-slate-300 hover:shadow-md',
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            dir="rtl"
            className={cn(
              'flex w-full min-h-[5.5rem] select-none items-center justify-between gap-4 px-6 py-5 sm:min-h-[6rem] sm:px-8 sm:py-6',
              'transition-colors hover:bg-slate-50/80',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/25',
            )}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
              <span className="min-w-0 flex-1 text-right text-base font-semibold leading-relaxed text-slate-900 sm:text-[1.05rem]">
                {title}
              </span>

              {!optional ? (
                <span className="flex h-10 min-w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 px-2.5 text-sm font-bold tabular-nums text-primary">
                  {n}
                </span>
              ) : null}

              {optional && (
                <span className="shrink-0 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  اختیاری
                </span>
              )}

              {!open && value.trim() !== '' && (
                <span className="max-w-full shrink truncate text-xs leading-relaxed text-slate-500 sm:max-w-[min(100%,20rem)]">
                  {value.trim()}
                </span>
              )}
            </div>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors group-hover:bg-white group-hover:text-slate-900">
              <ChevronDown
                className={cn('h-4 w-4 transition-transform duration-200', open && '-rotate-180')}
              />
            </span>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <div className="border-t border-slate-100 bg-slate-50/30 px-6 pb-8 pt-6 sm:px-8 sm:pb-10 sm:pt-8">
            {hintText ? (
              <p className="mb-3 text-right text-xs leading-relaxed text-slate-500 sm:text-sm">{hintText}</p>
            ) : null}
            <Textarea
              id={id}
              aria-label={title}
              placeholder={placeholder}
              dir="rtl"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={tall ? 6 : 4}
              className={cn(
                '!w-full !resize-y !rounded-xl !border !border-slate-200 !bg-white !px-4 !py-4 !text-sm !leading-7 !text-slate-900 !shadow-none !outline-none !ring-0',
                'placeholder:!text-right placeholder:!text-slate-400',
                'focus-visible:!border-primary/50 focus-visible:!ring-2 focus-visible:!ring-primary/15',
                tall ? '!min-h-[168px]' : '!min-h-[128px]',
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
  const [clinicalReportOpen, setClinicalReportOpen] = useState(true);
  const [supplementInputOpen, setSupplementInputOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(true);
  const [inputMethod, setInputMethod] = useState<'type' | 'voice' | 'image'>('type');
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState('');
  const [sessionEndedAt, setSessionEndedAt] = useState('');
  const [isSessionRunning, setIsSessionRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [ratePerMinute, setRatePerMinute] = useState('30000');
  const [targetMinutes, setTargetMinutes] = useState('45');
  const [targetNotified, setTargetNotified] = useState(false);

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

  const nowDateTimeLocal = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 19);
  };

  const dateToLocalInput = (d: Date) => {
    const offsetMs = d.getTimezoneOffset() * 60 * 1000;
    return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16);
  };

  const msToLocalDateTimeInput = (ms: number) => {
    const d = new Date(ms);
    const offsetMs = d.getTimezoneOffset() * 60 * 1000;
    return new Date(d.getTime() - offsetMs).toISOString().slice(0, 19);
  };

  const computeDurationMinutes = (startValue: string, endValue: string): number => {
    if (!startValue || !endValue) return 0;
    const startMs = new Date(startValue).getTime();
    const endMs = new Date(endValue).getTime();
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return 0;
    return Math.max(0, Math.round((endMs - startMs) / 60000));
  };

  const computeDurationSeconds = (startValue: string, endValue: string): number => {
    if (!startValue || !endValue) return 0;
    const startMs = new Date(startValue).getTime();
    const endMs = new Date(endValue).getTime();
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return 0;
    return Math.floor((endMs - startMs) / 1000);
  };

  const formatElapsed = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
  };

  useEffect(() => {
    if (!sessionStartedAt) {
      return;
    }
    const effectiveEnd = isSessionRunning ? nowDateTimeLocal() : sessionEndedAt;
    const totalSeconds = computeDurationSeconds(sessionStartedAt, effectiveEnd);
    setElapsedSeconds(totalSeconds);
    const minutes = computeDurationMinutes(sessionStartedAt, effectiveEnd);
    setFormData((prev) => ({ ...prev, duration: String(minutes) }));
    if (!isSessionRunning) return;

    const timer = window.setInterval(() => {
      const liveSeconds = computeDurationSeconds(sessionStartedAt, nowDateTimeLocal());
      const liveMinutes = computeDurationMinutes(sessionStartedAt, nowDateTimeLocal());
      setElapsedSeconds(liveSeconds);
      setFormData((prev) => ({ ...prev, duration: String(liveMinutes) }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [sessionStartedAt, sessionEndedAt, isSessionRunning]);

  useEffect(() => {
    const targetSecs = Number(targetMinutes || 0) * 60;
    if (!targetSecs || targetNotified) return;
    if (elapsedSeconds >= targetSecs) {
      toast.warning('زمان جلسه به سقف تعیین‌شده رسید. تایمر و محاسبه هزینه ادامه دارد.');
      setTargetNotified(true);
    }
  }, [elapsedSeconds, targetMinutes, targetNotified]);

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

  const billedMinutes = elapsedSeconds / 60;
  const liveCost = Math.round(billedMinutes * Number(ratePerMinute || 0));
  const targetSecs = Number(targetMinutes || 0) * 60;
  const progressPct = targetSecs > 0 ? Math.min(100, (elapsedSeconds / targetSecs) * 100) : 0;

  const handleBack = () => {
    if (onClose) onClose();
    else router.back();
  };

  const handleSave = () => {
    toast.success('یادداشت جلسه با موفقیت ذخیره شد');
    handleBack();
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-[#eceef4]" dir="rtl">
      <div className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8 py-5 sm:py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-start gap-4 text-right">
              <button
                type="button"
                onClick={handleBack}
                className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="بازگشت"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  افزودن یادداشت جلسه جدید
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                  ثبت ساختاریافتهٔ جلسه درمانی، زمان‌سنج و گزارش بالینی
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-primary/20 transition-all hover:bg-primary/92 hover:shadow-md sm:min-w-[11rem]"
            >
              <Save className="h-4 w-4 opacity-90" />
              ذخیره یادداشت
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8 py-10 sm:py-14">
        <div className="flex flex-col gap-12 sm:gap-14 lg:gap-16">
          {/* Top row: categories + basic info */}
          <div className="grid grid-cols-1 items-start gap-8 pb-2 lg:grid-cols-12 lg:gap-10 lg:pb-4">

          {/* ── Categories ── */}
          <div className="lg:col-span-4">
            <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
            <div className={cn(
              'overflow-hidden rounded-2xl border bg-white shadow-[0_2px_16px_-6px_rgba(15,23,42,0.08)] transition-all duration-200',
              categoriesOpen
                ? 'border-primary/35 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-primary/15'
                : 'border-slate-200/95 hover:border-slate-300 hover:shadow-[0_6px_24px_-10px_rgba(15,23,42,0.1)]',
            )}>
              {/* header */}
              <CollapsibleTrigger asChild>
              <button type="button" className={sessionPanelTriggerClasses(categoriesOpen)} dir="rtl">
                <div className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 transition-colors',
                  categoriesOpen && 'border-primary/30 bg-primary/[0.07] text-primary',
                )}>
                  <ChevronDown className={cn('h-[1.125rem] w-[1.125rem] transition-transform duration-200', categoriesOpen && '-rotate-180')} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1 pr-1 text-right sm:pr-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">دسته‌بندی موضوعات جلسه</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">موضوعات مطرح‌شده را علامت بزنید</p>
                </div>
              </button>
              </CollapsibleTrigger>

              {/* body */}
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
              <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-5 sm:px-5 sm:py-6">
                <div className="space-y-3" dir="rtl">
                  {formCategories.map((category) => (
                    <div key={category.id} className={cn(
                      'overflow-hidden rounded-xl border bg-white transition-all duration-150',
                      expandedCategories.includes(category.id)
                        ? 'border-primary/30 shadow-sm ring-1 ring-primary/10'
                        : 'border-slate-200/90 hover:border-slate-300',
                    )}>
                      <div
                        className={cn(
                          'flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors sm:gap-3.5 sm:px-4',
                          expandedCategories.includes(category.id)
                            ? 'bg-primary/[0.04]'
                            : 'hover:bg-slate-50/90',
                        )}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <span className="min-w-0 flex-1 text-right text-sm font-semibold leading-relaxed text-slate-800">
                          {category.title}
                        </span>
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategorySelect(category.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0"
                        />
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200',
                            expandedCategories.includes(category.id) && '-rotate-180',
                          )}
                        />
                      </div>

                      {expandedCategories.includes(category.id) && (
                        <div className="space-y-0.5 border-t border-slate-100 bg-slate-50/40 px-2 py-2 sm:px-3">
                          {category.subcategories.map((subcategory) => (
                            <div key={subcategory.id}>
                              <div
                                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-white"
                                onClick={() => toggleSubcategory(subcategory.id)}
                              >
                                <span className="min-w-0 flex-1 text-right text-[13px] font-medium leading-relaxed text-slate-700">
                                  {subcategory.title}
                                </span>
                                <Checkbox
                                  checked={selectedSubcategories.includes(subcategory.id)}
                                  onCheckedChange={() => handleSubcategorySelect(subcategory.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="shrink-0"
                                />
                                <ChevronLeft
                                  className={cn(
                                    'h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-150',
                                    expandedSubcategories.includes(subcategory.id) && '-rotate-90',
                                  )}
                                />
                              </div>

                              {expandedSubcategories.includes(subcategory.id) && (
                                <div className="space-y-0.5 border-slate-100/80 py-1 ps-4 sm:ps-6">
                                  {subcategory.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-white"
                                      onClick={() => handleItemSelect(item.id)}
                                    >
                                      <span className="min-w-0 flex-1 text-right text-xs leading-relaxed text-slate-600">
                                        {item.title}
                                      </span>
                                      <Checkbox
                                        checked={selectedItems.includes(item.id)}
                                        onCheckedChange={() => handleItemSelect(item.id)}
                                        className="shrink-0"
                                      />
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
          <div className="lg:col-span-8">
            <Collapsible open={basicInfoOpen} onOpenChange={setBasicInfoOpen}>
            <div className={cn(
              'overflow-hidden rounded-2xl border bg-white shadow-[0_2px_16px_-6px_rgba(15,23,42,0.08)] transition-all duration-200',
              basicInfoOpen
                ? 'border-primary/35 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-primary/15'
                : 'border-slate-200/95 hover:border-slate-300 hover:shadow-[0_6px_24px_-10px_rgba(15,23,42,0.1)]',
            )}>
              {/* header */}
              <CollapsibleTrigger asChild>
              <button type="button" className={sessionPanelTriggerClasses(basicInfoOpen)} dir="rtl">
                <div className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 transition-colors',
                  basicInfoOpen && 'border-primary/30 bg-primary/[0.07] text-primary',
                )}>
                  <ChevronDown className={cn('h-[1.125rem] w-[1.125rem] transition-transform duration-200', basicInfoOpen && '-rotate-180')} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1 pr-1 text-right sm:pr-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">اطلاعات اولیه جلسه</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">مشخصات مراجع و این جلسه</p>
                </div>
              </button>
              </CollapsibleTrigger>

              {/* body */}
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
              <div className="px-5 py-6 sm:px-8 sm:py-8" dir="rtl">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
                    <div className="sm:col-span-2 space-y-2.5">
                      <Label htmlFor="patientName" className="block text-right text-sm font-medium text-slate-700">نام و نام خانوادگی مراجع</Label>
                      <Input
                        id="patientName"
                        type="text"
                        placeholder="مثال: علی رضایی"
                        dir="rtl"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/80 text-right text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="age" className="block text-right text-sm font-medium text-slate-700">سن</Label>
                      <Input
                        id="age"
                        type="number"
                        min={0}
                        max={120}
                        placeholder="مثال: ۳۲"
                        dir="rtl"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/80 text-right text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="gender" className="block text-right text-sm font-medium text-slate-700">جنسیت</Label>
                      <select
                        id="gender"
                        dir="rtl"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-right text-sm text-slate-900 outline-none transition-all focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/15"
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="female">زن</option>
                        <option value="male">مرد</option>
                        <option value="other">سایر</option>
                      </select>
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="date" className="block text-right text-sm font-medium text-slate-700">تاریخ جلسه</Label>
                      <Input
                        id="date"
                        type="text"
                        placeholder="مثال: ۱۴۰۴/۸/۱۵"
                        dir="rtl"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/80 text-right text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="duration" className="block text-right text-sm font-medium text-slate-700">مدت جلسه</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="مدت خودکار"
                        dir="rtl"
                        value={formData.duration}
                        onChange={(e) => {
                          const nextMinutes = Math.max(0, Number(e.target.value || 0));
                          setFormData((prev) => ({ ...prev, duration: String(nextMinutes) }));
                          setElapsedSeconds(Math.round(nextMinutes * 60));
                          if (isSessionRunning || sessionStartedAt) {
                            setIsPaused(false);
                            const now = new Date();
                            const started = new Date(now.getTime() - nextMinutes * 60 * 1000);
                            setSessionStartedAt(dateToLocalInput(started));
                            if (!isSessionRunning) {
                              setSessionEndedAt(dateToLocalInput(now));
                            }
                          }
                        }}
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/80 text-right text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="mood" className="block text-right text-sm font-medium text-slate-700">حال عمومی مراجع</Label>
                      <Input
                        id="mood"
                        type="text"
                        placeholder="مثال: آرام، مضطرب، خوشحال"
                        dir="rtl"
                        value={formData.mood}
                        onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/80 text-right text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15"
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
          <Collapsible open={clinicalReportOpen} onOpenChange={setClinicalReportOpen}>
            <section
              className={cn(
                'overflow-hidden rounded-2xl border bg-white shadow-[0_2px_16px_-6px_rgba(15,23,42,0.08)] transition-all duration-200',
                clinicalReportOpen
                  ? 'border-primary/35 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-primary/15'
                  : 'border-slate-200/95 hover:border-slate-300 hover:shadow-[0_6px_24px_-10px_rgba(15,23,42,0.1)]',
              )}
              dir="rtl"
            >
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className={sessionPanelTriggerClasses(clinicalReportOpen)}
                  dir="rtl"
                >
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 transition-colors',
                      clinicalReportOpen && 'border-primary/30 bg-primary/[0.07] text-primary',
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        'h-[1.125rem] w-[1.125rem] transition-transform duration-200',
                        clinicalReportOpen && '-rotate-180',
                      )}
                      strokeWidth={2.2}
                    />
                  </div>
                  <div className="min-w-0 flex-1 pr-1 text-right sm:pr-2">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">گزارش بالینی جلسه</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      هر بخش را باز کنید و پر کنید.
                    </p>
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
                <div className="border-t border-slate-100 bg-slate-50/40 px-5 py-8 sm:px-8 sm:py-10">
                  <div className="mx-auto flex w-full max-w-[980px] flex-col gap-8 sm:gap-10">
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
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Input method */}
          <Collapsible open={supplementInputOpen} onOpenChange={setSupplementInputOpen}>
            <section
              className={cn(
                'overflow-hidden rounded-2xl border bg-white shadow-[0_2px_16px_-6px_rgba(15,23,42,0.08)] transition-all duration-200',
                supplementInputOpen
                  ? 'border-primary/35 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-primary/15'
                  : 'border-slate-200/95 hover:border-slate-300 hover:shadow-[0_6px_24px_-10px_rgba(15,23,42,0.1)]',
              )}
              dir="rtl"
            >
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className={sessionPanelTriggerClasses(supplementInputOpen)}
                  dir="rtl"
                >
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 transition-colors',
                      supplementInputOpen && 'border-primary/30 bg-primary/[0.07] text-primary',
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        'h-[1.125rem] w-[1.125rem] transition-transform duration-200',
                        supplementInputOpen && '-rotate-180',
                      )}
                      strokeWidth={2.2}
                    />
                  </div>
                  <div className="min-w-0 flex-1 pr-1 text-right sm:pr-2">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">روش ثبت مکمل</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      متن اصلی در بلوک بالا؛ اینجا صدا یا تصویر در صورت نیاز.
                    </p>
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
              <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
              <div
                className="flex w-full flex-col gap-2 rounded-xl border border-slate-200/90 bg-slate-50/80 p-1.5 sm:flex-row sm:gap-2"
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
                    'flex flex-1 items-center justify-center gap-2.5 rounded-lg py-3.5 text-sm font-medium transition-all sm:py-3',
                    inputMethod === 'type'
                      ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200/80'
                      : 'text-slate-600 hover:bg-white/90 hover:text-slate-900'
                  )}
                >
                  <Type className="h-4 w-4 shrink-0 opacity-90" />
                  تایپ
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={inputMethod === 'voice'}
                  onClick={() => setInputMethod('voice')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2.5 rounded-lg py-3.5 text-sm font-medium transition-all sm:py-3',
                    inputMethod === 'voice'
                      ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200/80'
                      : 'text-slate-600 hover:bg-white/90 hover:text-slate-900'
                  )}
                >
                  <Volume2 className="h-4 w-4 shrink-0 opacity-90" />
                  صدا
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={inputMethod === 'image'}
                  onClick={() => setInputMethod('image')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2.5 rounded-lg py-3.5 text-sm font-medium transition-all sm:py-3',
                    inputMethod === 'image'
                      ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200/80'
                      : 'text-slate-600 hover:bg-white/90 hover:text-slate-900'
                  )}
                >
                  <ImageIcon className="h-4 w-4 shrink-0 opacity-90" />
                  تصویر
                </button>
              </div>

              {inputMethod === 'type' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 text-right sm:px-5 sm:py-5"
                  dir="rtl"
                >
                  <p className="text-sm leading-relaxed text-slate-600">
                    فیلدهای بالا برای ثبت متن کافی‌اند؛ این بخش برای ضبط یا اسکن اختیاری است.
                  </p>
                </motion.div>
              )}

              {/* Voice Recording Method */}
              {inputMethod === 'voice' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-6"
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
                  className="w-full space-y-4"
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
              </div>
              </CollapsibleContent>
            </section>
          </Collapsible>

          {/* Session timer */}
          <Collapsible open={timerOpen} onOpenChange={setTimerOpen}>
            <section
              className={cn(
                'overflow-hidden rounded-2xl border bg-white shadow-[0_2px_16px_-6px_rgba(15,23,42,0.08)] transition-all duration-200',
                timerOpen
                  ? 'border-primary/35 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-primary/15'
                  : 'border-slate-200/95 hover:border-slate-300 hover:shadow-[0_6px_24px_-10px_rgba(15,23,42,0.1)]',
              )}
              dir="rtl"
            >
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className={sessionPanelTriggerClasses(timerOpen)}
                  dir="rtl"
                >
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 transition-colors',
                      timerOpen && 'border-primary/30 bg-primary/[0.07] text-primary',
                    )}
                  >
                    <ChevronDown className={cn('h-[1.125rem] w-[1.125rem] transition-transform duration-200', timerOpen && '-rotate-180')} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0 flex-1 pr-1 text-right sm:pr-2">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">تایمر جلسه</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">مدیریت زمان و محاسبهٔ هزینهٔ جلسه</p>
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
              <div className="overflow-hidden" dir="rtl">
              <div className="flex flex-col gap-6 px-5 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <span className="text-sm font-semibold text-slate-800">وضعیت تایمر</span>
                <span className={cn(
                  'inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold sm:self-auto',
                  isSessionRunning
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : isPaused
                      ? 'border-amber-200 bg-amber-50 text-amber-900'
                      : 'border-slate-200 bg-slate-100 text-slate-600',
                )}>
                  <span className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    isSessionRunning ? 'animate-pulse bg-emerald-500' : isPaused ? 'bg-amber-500' : 'bg-slate-400',
                  )} />
                  {isSessionRunning ? 'در حال اجرا' : isPaused ? 'مکث' : 'متوقف'}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 px-4 py-8 text-center sm:px-8 sm:py-10">
                <motion.p
                  key={`${isSessionRunning}-${isPaused}`}
                  initial={{ scale: 0.99, opacity: 0.92 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'font-mono text-[3.25rem] font-bold leading-none tabular-nums tracking-widest transition-colors duration-300 sm:text-5xl md:text-6xl',
                    isSessionRunning ? 'text-primary' : isPaused ? 'text-amber-600' : 'text-slate-400',
                  )}
                >
                  {formatElapsed(elapsedSeconds)}
                </motion.p>
                <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">ساعت · دقیقه · ثانیه</p>
                <div className="mx-auto mt-4 flex min-h-[2.75rem] max-w-lg items-center justify-center px-2 text-center">
                  <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {isSessionRunning
                      ? 'زمان جلسه در حال ثبت است؛ با «مکث» می‌توانید بدون بستن جلسه توقف کنید.'
                      : isPaused
                        ? 'مدت مکث در محاسبه لحاظ نمی‌شود. برای ادامه «ادامه» را بزنید.'
                        : 'برای شمارش، «شروع جلسه» را بزنید.'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 sm:text-sm">
                  <span>{Math.round(progressPct)}٪ از هدف</span>
                  <span>{Number(targetMinutes || 0)} دقیقه</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn(
                      'h-full rounded-full transition-[width] duration-700 ease-out',
                      progressPct >= 100 ? 'bg-red-500' : 'bg-primary',
                    )}
                    style={{ width: `${Math.min(100, progressPct)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-200/90 rounded-xl border border-slate-200/90 bg-slate-50/50" style={{ direction: 'ltr' }}>
                <div className="px-3 py-4 text-center sm:px-4 sm:py-5">
                  <p className="mb-1 text-xs text-slate-500">دقیقه</p>
                  <p className="text-xl font-bold tabular-nums text-slate-800 sm:text-2xl">{Number(formData.duration || 0)}</p>
                </div>
                <div className="px-3 py-4 text-center sm:px-4 sm:py-5">
                  <p className="mb-1 text-xs text-slate-500">نرخ / دقیقه</p>
                  <p className="text-xl font-bold tabular-nums text-slate-800 sm:text-2xl">{Number(ratePerMinute || 0).toLocaleString('fa-IR')}</p>
                </div>
                <div className="px-3 py-4 text-center sm:px-4 sm:py-5">
                  <p className="mb-1 text-xs text-slate-500">هزینه (تومان)</p>
                  <p className="text-xl font-bold tabular-nums text-primary sm:text-2xl">{liveCost.toLocaleString('fa-IR')}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSessionStartedAt(nowDateTimeLocal());
                      setSessionEndedAt('');
                      setIsSessionRunning(true);
                      setIsPaused(false);
                      setTargetNotified(false);
                    }}
                    disabled={isSessionRunning || isPaused}
                    className={cn(
                      'inline-flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-sm transition-all',
                      isSessionRunning || isPaused
                        ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md',
                    )}
                  >
                    شروع جلسه
                  </button>
                  {isPaused ? (
                    <button
                      type="button"
                      onClick={() => {
                        const frozen = computeDurationSeconds(sessionStartedAt, sessionEndedAt);
                        if (!sessionStartedAt || !sessionEndedAt || frozen < 0) {
                          toast.error('ادامه ممکن نیست؛ زمان شروع یا پایان مکث را بررسی کنید');
                          return;
                        }
                        setSessionStartedAt(msToLocalDateTimeInput(Date.now() - frozen * 1000));
                        setSessionEndedAt('');
                        setIsSessionRunning(true);
                        setIsPaused(false);
                      }}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-primary/35 bg-primary/10 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                    >
                      <Play className="h-4 w-4 shrink-0" aria-hidden />
                      ادامه
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSessionEndedAt(nowDateTimeLocal());
                        setIsSessionRunning(false);
                        setIsPaused(true);
                      }}
                      disabled={!isSessionRunning}
                      className={cn(
                        'inline-flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all',
                        isSessionRunning
                          ? 'border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100'
                          : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400',
                      )}
                    >
                      <Pause className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      مکث
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (isPaused) {
                        setIsPaused(false);
                        return;
                      }
                      setSessionEndedAt(nowDateTimeLocal());
                      setIsSessionRunning(false);
                      setIsPaused(false);
                    }}
                    disabled={!isSessionRunning && !isPaused}
                    className={cn(
                      'inline-flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-sm transition-all',
                      !isSessionRunning && !isPaused
                        ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md',
                    )}
                  >
                    توقف جلسه
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSessionStartedAt('');
                    setSessionEndedAt('');
                    setIsSessionRunning(false);
                    setIsPaused(false);
                    setElapsedSeconds(0);
                    setTargetNotified(false);
                    setFormData((prev) => ({ ...prev, duration: '' }));
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto sm:self-center sm:px-10"
                >
                  ریست تایمر
                </button>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 px-4 py-5 sm:px-5 sm:py-6">
                <p className="mb-4 text-right text-sm font-semibold text-slate-800">تنظیمات زمان و تعرفه</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                  <div className="space-y-2">
                    <label className="block text-right text-xs font-medium text-slate-600 sm:text-sm">تعرفه هر دقیقه (تومان)</label>
                    <Input
                      type="number"
                      dir="rtl"
                      value={ratePerMinute}
                      onChange={(e) => setRatePerMinute(e.target.value)}
                      placeholder="30000"
                      className="h-11 rounded-xl border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-right text-xs font-medium text-slate-600 sm:text-sm">هدف جلسه (دقیقه)</label>
                    <Input
                      type="number"
                      dir="rtl"
                      value={targetMinutes}
                      onChange={(e) => {
                        setTargetMinutes(e.target.value);
                        setTargetNotified(false);
                      }}
                      placeholder="45"
                      className="h-11 rounded-xl border-slate-200 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>
              </div>
              </div>
              </CollapsibleContent>
            </section>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
