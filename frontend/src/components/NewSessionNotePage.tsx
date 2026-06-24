import { useEffect, useState, useCallback } from 'react';
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
  Clock,
  Banknote,
  Square,
} from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { cn } from './ui/utils';
import { toast } from 'sonner';
import { HomeworkPickerField } from './HomeworkPickerField';
import { useSpeechRecognition, isSpeechRecognitionSupported } from '@/hooks/useSpeechRecognition';
import { VOICE_FIELD_OPTIONS, type VoiceTargetField } from '@/types/sessionNote';

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
    'flex min-h-[5.75rem] w-full cursor-pointer select-none items-center gap-6 bg-gradient-to-l from-slate-50 to-white px-8 py-6 text-right transition-colors sm:min-h-[6.25rem] sm:gap-6 sm:px-10 sm:py-7',
    'hover:from-slate-50 hover:to-slate-50/80',
    open ? 'border-b border-slate-200/80' : 'border-b border-transparent',
  );
}

const sessionFieldControlClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-right text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:outline-none';

const sessionControlBtnClass =
  'flex h-12 flex-1 items-center justify-center gap-2 overflow-visible rounded-xl px-3 text-sm font-bold leading-none whitespace-nowrap';

const timerPanelClass = 'w-full text-start';
const timerCardPadding =
  'rounded-2xl border border-slate-200/90 bg-white px-5 py-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:px-7 sm:py-7';

function SessionFormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-3">
      <Label htmlFor={id} className="block text-right text-[13px] font-semibold leading-normal text-slate-700">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ClinicalField({
  id,
  title,
  placeholder,
  value,
  onChange,
  tall,
  optional,
}: {
  id: string;
  title: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  tall?: boolean;
  optional?: boolean;
}) {
  const [open, setOpen] = useState(() => value.trim().length > 0);

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
              'flex w-full select-none items-center gap-4 py-4',
              'transition-colors hover:bg-slate-50/80',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/25',
            )}
            style={{
              paddingInlineStart: '1.5rem',
              paddingInlineEnd: '1.25rem',
              minHeight: '3.5rem',
            }}
          >
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200/90 bg-white text-slate-600 transition-colors',
                open && 'border-primary/30 bg-primary/[0.07] text-primary',
              )}
              style={{ marginInlineStart: '0.375rem' }}
            >
              <ChevronDown
                className={cn('h-4 w-4 transition-transform duration-200', open && '-rotate-180')}
                strokeWidth={2}
              />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-1 text-right">
              <span className="text-base font-semibold leading-relaxed text-slate-900 sm:text-[1.05rem]">
                {title}
              </span>
              {!open && value.trim() !== '' && (
                <span className="truncate text-xs leading-relaxed text-slate-500">
                  {value.trim()}
                </span>
              )}
            </div>

            {optional ? (
              <span className="shrink-0 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                اختیاری
              </span>
            ) : null}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <div
            className="border-t border-slate-100 bg-slate-50/30"
            style={{ padding: '1.5rem 1.25rem 1.5rem' }}
          >
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
  const [voiceTargetField, setVoiceTargetField] = useState<VoiceTargetField>('summary');
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
    nextSessionGoals: '',
    considerations: '',
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

  const sessionActive = isSessionRunning || isPaused;

  const startSession = () => {
    setSessionStartedAt(nowDateTimeLocal());
    setSessionEndedAt('');
    setIsSessionRunning(true);
    setIsPaused(false);
    setTargetNotified(false);
  };

  const endSession = () => {
    setSessionEndedAt((prev) => prev || nowDateTimeLocal());
    setIsSessionRunning(false);
    setIsPaused(false);
  };

  const togglePauseSession = () => {
    if (!isSessionRunning && !isPaused) return;
    if (isPaused) {
      const frozen = computeDurationSeconds(sessionStartedAt, sessionEndedAt);
      if (!sessionStartedAt || !sessionEndedAt || frozen < 0) {
        toast.error('ادامه ممکن نیست؛ زمان شروع یا پایان مکث را بررسی کنید');
        return;
      }
      setSessionStartedAt(msToLocalDateTimeInput(Date.now() - frozen * 1000));
      setSessionEndedAt('');
      setIsSessionRunning(true);
      setIsPaused(false);
      return;
    }
    setSessionEndedAt(nowDateTimeLocal());
    setIsSessionRunning(false);
    setIsPaused(true);
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

  const appendTranscriptToField = useCallback((text: string) => {
    setFormData((prev) => {
      const current = prev[voiceTargetField];
      return {
        ...prev,
        [voiceTargetField]: current ? `${current} ${text}` : text,
      };
    });
  }, [voiceTargetField]);

  const {
    isListening,
    isReconnecting,
    segmentCount,
    interimText,
    sessionTranscript,
    start: startSpeech,
    stop: stopSpeech,
    resetSession: resetSpeechSession,
  } = useSpeechRecognition({
    lang: 'fa-IR',
    onFinal: appendTranscriptToField,
    onError: (message) => toast.error(message),
  });

  const speechSupported = isSpeechRecognitionSupported();

  const handleRecordToggle = () => {
    if (isListening) {
      stopSpeech();
      toast.success('ضبط متوقف شد');
      return;
    }
    startSpeech();
    toast.success('شروع ضبط صدا...');
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
    if (isListening) {
      stopSpeech();
    }
    resetSpeechSession();
    toast.success('یادداشت جلسه با موفقیت ذخیره شد');
    handleBack();
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-[#eceef4]" dir="rtl">
      <div className="sticky top-0 z-30 mb-6 border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto w-full max-w-6xl px-4 px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex min-w-0 flex-1 items-start gap-4 text-right">
              <button
                type="button"
                onClick={handleBack}
                className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="بازگشت"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              <div className="min-w-0 space-y-2">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900">
                  افزودن یادداشت جلسه جدید
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-slate-600">
                  ثبت ساختاریافتهٔ جلسه درمانی، زمان‌سنج و گزارش بالینی
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-primary/20 transition-all hover:bg-primary/92 hover:shadow-md"
              style={{ minWidth: '11rem' }}
            >
              <Save className="h-4 w-4 opacity-90" />
              ذخیره یادداشت
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 px-8 py-6" style={{ paddingTop: '1.5rem' }}>
        <div
          className="grid grid-cols-1 items-start lg:grid-cols-12"
          style={{ gap: '1.25rem' }}
        >
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
                <div className="min-w-0 flex-1 text-right">
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
                <div className="min-w-0 flex-1 text-right">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">اطلاعات اولیه جلسه</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">مشخصات مراجع و این جلسه</p>
                </div>
              </button>
              </CollapsibleTrigger>

              {/* body */}
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
              <div className="border-t border-slate-100" style={{ padding: '0.75rem 1rem 1.25rem' }}>
                <div
                  className="rounded-xl bg-slate-50/40 px-6 py-8"
                  dir="rtl"
                  style={{ paddingBottom: '2rem' }}
                >
                <div className="space-y-8">
                  <div className="flex flex-col gap-6" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <div style={{ flex: '2 1 14rem', minWidth: '14rem' }}>
                      <SessionFormField id="patientName" label="نام و نام خانوادگی مراجع">
                        <Input
                          id="patientName"
                          type="text"
                          placeholder="مثال: علی رضایی"
                          dir="rtl"
                          value={formData.patientName}
                          onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                          className={sessionFieldControlClass}
                        />
                      </SessionFormField>
                    </div>
                    <div style={{ flex: '1 1 9rem', minWidth: '9rem' }}>
                      <SessionFormField id="age" label="سن">
                        <Input
                          id="age"
                          type="number"
                          min={0}
                          max={120}
                          placeholder="مثال: ۳۲"
                          dir="rtl"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className={sessionFieldControlClass}
                        />
                      </SessionFormField>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <SessionFormField id="gender" label="جنسیت">
                      <select
                        id="gender"
                        dir="rtl"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className={sessionFieldControlClass}
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="female">زن</option>
                        <option value="male">مرد</option>
                        <option value="other">سایر</option>
                      </select>
                    </SessionFormField>
                    <SessionFormField id="date" label="تاریخ جلسه">
                      <Input
                        id="date"
                        type="text"
                        placeholder="مثال: ۱۴۰۴/۸/۱۵"
                        dir="rtl"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={sessionFieldControlClass}
                      />
                    </SessionFormField>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <SessionFormField id="duration" label="مدت جلسه">
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
                        className={sessionFieldControlClass}
                      />
                    </SessionFormField>
                    <SessionFormField id="mood" label="حال عمومی مراجع">
                      <Input
                        id="mood"
                        type="text"
                        placeholder="مثال: آرام، مضطرب، خوشحال"
                        dir="rtl"
                        value={formData.mood}
                        onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                        className={sessionFieldControlClass}
                      />
                    </SessionFormField>
                  </div>

                </div>
                </div>
              </div>
              </CollapsibleContent>
            </div>
            </Collapsible>
          </div>

          {/* Clinical report */}
          <div className="lg:col-span-12">
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
                  <div className="min-w-0 flex-1 text-right">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">گزارش بالینی جلسه</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      هر بخش را باز کنید و پر کنید.
                    </p>
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
                <div className="border-t border-slate-100 bg-slate-50/40 px-5 py-8 sm:px-8 sm:py-10">
                  <div className="mx-auto flex w-full max-w-[980px] flex-col gap-6">
                    <ClinicalField
                      id="chiefComplaint"
                      title="شکایت اصلی مراجع"
                      placeholder="مثال: اضطراب اجتماعی، بی‌خوابی، ..."
                      value={formData.chiefComplaint}
                      onChange={(v) => setFormData({ ...formData, chiefComplaint: v })}
                    />
                    <ClinicalField
                      id="historyBackground"
                      title="پیشینه و سابقه مشکل"
                      placeholder="زمان شروع، سوابق، خانواده..."
                      value={formData.historyBackground}
                      onChange={(v) => setFormData({ ...formData, historyBackground: v })}
                    />
                    <ClinicalField
                      id="sessionObjective"
                      title="دستور و هدف جلسه فعلی"
                      placeholder="مثال: آموزش تنفس، کار روی باورها..."
                      value={formData.sessionObjective}
                      onChange={(v) => setFormData({ ...formData, sessionObjective: v })}
                    />
                    <ClinicalField
                      id="summary"
                      title="خلاصه جلسه"
                      placeholder="رویدادها، مباحث اصلی، مشاهدات..."
                      value={formData.summary}
                      onChange={(v) => setFormData({ ...formData, summary: v })}
                      tall
                    />
                    <ClinicalField
                      id="formulation"
                      title="فرمولاسیون و تحلیل بالینی"
                      placeholder="تحلیل شناختی–عاطفی، طرحواره..."
                      value={formData.formulation}
                      onChange={(v) => setFormData({ ...formData, formulation: v })}
                    />
                    <ClinicalField
                      id="treatmentPlan"
                      title="طرح درمان"
                      placeholder="رویکرد، گام بعدی، اولویت‌ها..."
                      value={formData.treatmentPlan}
                      onChange={(v) => setFormData({ ...formData, treatmentPlan: v })}
                    />
                    <HomeworkPickerField
                      value={formData.homework}
                      onChange={(v) => setFormData({ ...formData, homework: v })}
                    />
                    <ClinicalField
                      id="nextSessionGoals"
                      title="اهداف جلسه بعد"
                      placeholder="موضوعات یا اهداف جلسه آینده..."
                      value={formData.nextSessionGoals}
                      onChange={(v) => setFormData({ ...formData, nextSessionGoals: v })}
                      optional
                    />
                    <ClinicalField
                      id="considerations"
                      title="ملاحظات درمانگر"
                      placeholder="احتیاط‌ها، نگرانی‌های بالینی، نکات پیگیری و دستورالعمل‌های درمان — فقط برای پرونده درمانگر"
                      value={formData.considerations}
                      onChange={(v) => setFormData({ ...formData, considerations: v })}
                      optional
                      tall
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>
          </div>

          {/* Input method */}
          <div className="lg:col-span-12">
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
                  <div className="min-w-0 flex-1 text-right">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">یادداشت و ضبط صوت</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      تایپ یادداشت جلسه، ضبط صدا یا بارگذاری تصویر.
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
                  {!speechSupported && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-right text-sm text-amber-900">
                      تشخیص گفتار در این مرورگر پشتیبانی نمی‌شود. لطفاً از Chrome یا Edge استفاده کنید.
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 text-right sm:px-5">
                    <Label htmlFor="voice-target-field" className="mb-2 block text-sm font-medium text-slate-700">
                      افزودن متن به بخش
                    </Label>
                    <select
                      id="voice-target-field"
                      value={voiceTargetField}
                      onChange={(e) => setVoiceTargetField(e.target.value as VoiceTargetField)}
                      disabled={isListening}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                      dir="rtl"
                    >
                      {VOICE_FIELD_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      متن گفتار به‌صورت خودکار به فیلد انتخاب‌شده اضافه می‌شود. با توقف و شروع دوباره، متن جدید به همان متن قبلی اضافه می‌شود تا زمانی که یادداشت را ذخیره کنید.
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/25 bg-gradient-to-b from-primary/[0.04] to-transparent py-10 px-5 sm:py-12 sm:px-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all ${
                      isListening
                        ? 'bg-[#eb5757] animate-pulse'
                        : 'bg-primary'
                    }`}>
                      <Mic className="w-10 h-10 text-white" />
                    </div>

                    <p className="text-lg text-foreground mb-2 text-center">
                      {isReconnecting
                        ? 'در حال اتصال مجدد...'
                        : isListening
                          ? 'در حال ضبط...'
                          : 'آماده برای ضبط صدا'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-6 text-center">
                      {isReconnecting
                        ? 'Chrome هر ~۱۰–۱۵ ثانیه ضبط را قطع و دوباره وصل می‌کند — چند لحظه صبر کنید'
                        : isListening
                          ? 'صدای شما به متن تبدیل می‌شود (تشخیص گفتار Chrome)'
                          : 'برای شروع ضبط، دکمه زیر را بزنید'}
                    </p>

                    <button
                      type="button"
                      onClick={handleRecordToggle}
                      disabled={!speechSupported}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        isListening
                          ? 'bg-[#eb5757] hover:bg-[#d94848] text-white'
                          : 'bg-primary hover:bg-primary-hover text-primary-foreground'
                      }`}
                    >
                      {isListening ? (
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

                  {(isListening || sessionTranscript || interimText) && (
                    <div className="space-y-3 rounded-xl border border-primary/20 bg-accent/30 p-4">
                      <p className="text-sm text-muted-foreground text-right">متن تبدیل‌شده:</p>
                      <p className="text-foreground text-right leading-relaxed whitespace-pre-wrap" dir="rtl">
                        {sessionTranscript}
                        {interimText ? (
                          <span className="text-slate-500 italic">
                            {sessionTranscript ? ' ' : ''}
                            {interimText}
                          </span>
                        ) : null}
                      </p>
                      {!sessionTranscript && !interimText && isListening && !isReconnecting && (
                        <p className="text-sm text-slate-500 text-right">در حال گوش دادن...</p>
                      )}
                      {isListening && segmentCount > 1 && (
                        <p className="text-xs text-slate-400 text-right">
                          بخش ضبط: {segmentCount} (هر بخش حدود ۱۰–۱۵ ثانیه است)
                        </p>
                      )}
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
          </div>

          {/* Session timer */}
          <div className="lg:col-span-12">
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
                  <div className="min-w-0 flex-1 text-right">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">تایمر جلسه</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">مدیریت زمان و محاسبهٔ هزینهٔ جلسه</p>
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
              <div className="overflow-hidden" dir="rtl">
              <motion.div className={cn('flex flex-col gap-8 px-5 py-6 sm:px-8 sm:py-8', timerPanelClass)} dir="rtl">
              <motion.div
                className={cn(
                  'relative overflow-hidden rounded-2xl border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]',
                  isSessionRunning
                    ? 'border-primary/25 bg-gradient-to-br from-primary/[0.06] via-white to-slate-50/80'
                    : isPaused
                      ? 'border-amber-200/80 bg-gradient-to-br from-amber-50/50 via-white to-slate-50/80'
                      : 'border-slate-200/90 bg-gradient-to-br from-slate-50/40 via-white to-white',
                )}
              >
                {isSessionRunning && (
                  <motion.div
                    className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
                    aria-hidden
                  />
                )}
                <div className="relative px-6 pb-8 pt-7 sm:px-10 sm:pb-10 sm:pt-9">
                  <div className={cn('mb-8 w-full', timerPanelClass)}>
                    <p className="text-sm font-semibold text-slate-800">وضعیت تایمر</p>
                    <p className="mt-3 w-full text-xs leading-relaxed text-slate-500">
                      {isSessionRunning
                        ? 'زمان جلسه در حال ثبت است؛ با «مکث» می‌توانید بدون بستن جلسه توقف کنید.'
                        : isPaused
                          ? 'مدت مکث در محاسبه لحاظ نمی‌شود. «ادامه» یا «توقف جلسه» را بزنید.'
                          : 'برای شمارش، «شروع جلسه» را بزنید.'}
                    </p>
                  </div>

                  <div
                    className="mx-auto flex w-full max-w-xl flex-wrap items-center justify-center gap-2 px-2 py-3 sm:gap-4 sm:px-5 sm:py-5"
                    dir="ltr"
                  >
                    {[
                      { value: Math.floor(elapsedSeconds / 3600), label: 'ساعت' },
                      { value: Math.floor((elapsedSeconds % 3600) / 60), label: 'دقیقه' },
                      { value: elapsedSeconds % 60, label: 'ثانیه' },
                    ].map((seg, i, arr) => (
                      <div key={seg.label} className="flex items-center gap-2 sm:gap-4">
                        <div className="flex min-w-[4.25rem] flex-1 flex-col items-center justify-center rounded-xl border border-slate-200/90 bg-white px-3 py-3.5 shadow-sm sm:min-w-[5.5rem] sm:flex-none sm:px-6 sm:py-6 md:min-w-[6rem]">
                          <span
                            className={cn(
                              'text-center font-mono text-2xl font-bold tabular-nums leading-none sm:text-3xl md:text-4xl',
                              isSessionRunning ? 'text-primary' : isPaused ? 'text-[#f2c94c]' : 'text-slate-800',
                            )}
                          >
                            {String(seg.value).padStart(2, '0')}
                          </span>
                          <span className="mt-1.5 text-center text-[10px] font-medium leading-tight text-slate-500 sm:mt-2.5 sm:text-xs">
                            {seg.label}
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <span
                            aria-hidden
                            className={cn(
                              'self-center font-mono text-2xl font-light leading-none tabular-nums sm:text-3xl md:text-4xl',
                              isSessionRunning ? 'text-primary/50' : 'text-slate-300',
                            )}
                          >
                            :
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200/70 bg-white/60 px-5 py-4 sm:px-8">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn(
                        'h-full rounded-full transition-[width] duration-700 ease-out',
                        progressPct >= 100
                          ? 'bg-gradient-to-l from-red-500 to-red-400'
                          : 'bg-gradient-to-l from-primary to-primary/75',
                      )}
                      style={{ width: `${Math.min(100, progressPct)}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" dir="rtl">
                {[
                  {
                    icon: Clock,
                    label: 'مدت جلسه',
                    sub: 'دقیقه',
                    value: Number(formData.duration || 0).toLocaleString('fa-IR'),
                    card: 'border-slate-200/80 bg-gradient-to-bl from-slate-50/90 via-white to-white',
                    iconWrap: 'border-slate-200/80 bg-white text-slate-600 shadow-sm',
                    valueClass: 'text-slate-900',
                  },
                  {
                    icon: Banknote,
                    label: 'نرخ هر دقیقه',
                    sub: 'تومان',
                    value: Number(ratePerMinute || 0).toLocaleString('fa-IR'),
                    card: 'border-[#f2c94c]/25 bg-gradient-to-bl from-[#fffbeb]/80 via-white to-white',
                    iconWrap: 'border-[#f2c94c]/30 bg-[#fff9e6] text-[#b8860b] shadow-sm',
                    valueClass: 'text-slate-900',
                  },
                  {
                    icon: Banknote,
                    label: 'هزینه جلسه',
                    sub: 'تومان',
                    value: liveCost.toLocaleString('fa-IR'),
                    card: 'border-primary/25 bg-gradient-to-bl from-primary/[0.08] via-white to-white ring-1 ring-primary/10',
                    iconWrap: 'border-primary/25 bg-primary/10 text-primary shadow-sm',
                    valueClass: 'text-primary',
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      'relative overflow-hidden rounded-2xl border p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.08)] sm:p-6',
                      stat.card,
                    )}
                  >
                    <div
                      className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl"
                      aria-hidden
                    />
                    <div className={cn('relative flex w-full flex-col items-start gap-4', timerPanelClass)} dir="rtl">
                      <div className="flex w-full items-center justify-start gap-4 sm:gap-5">
                        <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                            stat.iconWrap,
                          )}
                        >
                          <stat.icon className="h-5 w-5" strokeWidth={2.2} aria-hidden />
                        </div>
                      </div>
                      <div className="w-full space-y-2">
                        <p
                          className={cn(
                            'text-2xl font-bold tabular-nums leading-none tracking-tight sm:text-[1.75rem]',
                            stat.valueClass,
                          )}
                        >
                          {stat.value}
                        </p>
                        <p className="text-xs font-medium text-slate-400">{stat.sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={timerCardPadding}>
                <p className={cn('mb-8 w-full text-sm font-semibold text-slate-800 sm:mb-9', timerPanelClass)}>
                  کنترل جلسه
                </p>
                <div
                  role="group"
                  aria-label="کنترل جلسه"
                  className="flex gap-2.5 rounded-2xl border border-slate-200 bg-slate-100 p-3 sm:gap-3 sm:p-3.5"
                >
                  <button
                    type="button"
                    aria-disabled={sessionActive}
                    tabIndex={sessionActive ? -1 : 0}
                    onClick={() => {
                      if (sessionActive) return;
                      startSession();
                    }}
                    className={cn(
                      sessionControlBtnClass,
                      sessionActive
                        ? 'pointer-events-none bg-slate-200 text-slate-600'
                        : 'bg-primary text-white shadow-sm hover:bg-primary/90',
                    )}
                  >
                    <span className="shrink-0">شروع</span>
                    <Play className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-disabled={!isSessionRunning && !isPaused}
                    tabIndex={!isSessionRunning && !isPaused ? -1 : 0}
                    onClick={togglePauseSession}
                    className={cn(
                      sessionControlBtnClass,
                      !isSessionRunning && !isPaused
                        ? 'pointer-events-none bg-slate-200 text-slate-600'
                        : isPaused
                          ? 'bg-primary text-white shadow-sm hover:bg-primary/90'
                          : 'bg-[#f2c94c] text-[#1f2933] shadow-sm hover:brightness-95',
                    )}
                  >
                    <span className="shrink-0">{isPaused ? 'ادامه' : 'مکث'}</span>
                    {isPaused ? (
                      <Play className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                    ) : (
                      <Pause className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-disabled={!sessionActive}
                    tabIndex={!sessionActive ? -1 : 0}
                    onClick={() => {
                      if (!sessionActive) return;
                      endSession();
                    }}
                    className={cn(
                      sessionControlBtnClass,
                      !sessionActive
                        ? 'pointer-events-none bg-slate-200 text-slate-600'
                        : 'bg-[#eb5757] text-white shadow-sm hover:bg-[#d94848]',
                    )}
                  >
                    <span className="shrink-0">توقف</span>
                    <Square className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden />
                  </button>
                </div>
              </div>

              <div className={timerCardPadding}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8">
                  <div className="space-y-2.5">
                    <label className={cn('block w-full text-xs font-medium text-slate-600 sm:text-sm', timerPanelClass)}>
                      تعرفه هر دقیقه (تومان)
                    </label>
                    <Input
                      type="number"
                      dir="rtl"
                      value={ratePerMinute}
                      onChange={(e) => setRatePerMinute(e.target.value)}
                      placeholder="۳۰٬۰۰۰"
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-start text-sm focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className={cn('block w-full text-xs font-medium text-slate-600 sm:text-sm', timerPanelClass)}>
                      هدف جلسه (دقیقه)
                    </label>
                    <Input
                      type="number"
                      dir="rtl"
                      value={targetMinutes}
                      onChange={(e) => {
                        setTargetMinutes(e.target.value);
                        setTargetNotified(false);
                      }}
                      placeholder="۴۵"
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-start text-sm focus:bg-white"
                    />
                  </div>
                </div>
              </div>
              </motion.div>
              </div>
              </CollapsibleContent>
            </section>
          </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
