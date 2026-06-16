'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, BookMarked, Plus, Trash2, Check, X, ChevronLeft } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Textarea } from './ui/textarea';
import { cn } from './ui/utils';
import { toast } from 'sonner';

/* ─── Pre-defined library ───────────────────────────── */
interface PresetItem {
  id: string;
  text: string;
}
interface PresetCategory {
  id: string;
  label: string;
  items: PresetItem[];
}

const PRESET_LIBRARY: PresetCategory[] = [
  {
    id: 'mindfulness',
    label: 'ذهن‌آگاهی و تنفس',
    items: [
      { id: 'p1', text: 'هر شب ۱۰ دقیقه تنفس دیافراگمی تمرین کنید' },
      { id: 'p2', text: 'روزانه ۵ دقیقه مدیتیشن باکس بریدینگ (۴-۴-۴-۴)' },
      { id: 'p3', text: 'قبل از خواب اسکن بدن (body scan) انجام دهید' },
      { id: 'p4', text: 'هر روز ۱ دقیقه تمرین ۵-۴-۳-۲-۱ حواس پنجگانه' },
    ],
  },
  {
    id: 'cbt',
    label: 'درمان شناختی–رفتاری',
    items: [
      { id: 'c1', text: 'افکار منفی خودکار را در جدول ABC ثبت کنید' },
      { id: 'c2', text: 'هر روز یک تحریف شناختی که تجربه کردید بنویسید و به آن پاسخ دهید' },
      { id: 'c3', text: 'فهرستی از باورهای ناکارآمد تهیه و شواهد مخالف آن‌ها را بیابید' },
      { id: 'c4', text: 'تکنیک آزمایش رفتاری: یک ترس کوچک را امتحان کنید و نتیجه را ثبت کنید' },
    ],
  },
  {
    id: 'journaling',
    label: 'نوشتن و ثبت احساسات',
    items: [
      { id: 'j1', text: 'هر شب ۵ دقیقه احساسات روزانه را در دفترچه بنویسید' },
      { id: 'j2', text: 'روزانه سه چیزی که برای آن‌ها سپاسگزار هستید بنویسید' },
      { id: 'j3', text: 'یادداشت خلق‌وخو: صبح و شب حال خود را از ۱ تا ۱۰ ثبت کنید' },
      { id: 'j4', text: 'نامه‌ای به خود در گذشته بنویسید و با مهربانی با آن صحبت کنید' },
    ],
  },
  {
    id: 'behavioral',
    label: 'فعال‌سازی رفتاری',
    items: [
      { id: 'b1', text: 'پیاده‌روی ۳۰ دقیقه‌ای سه‌بار در هفته' },
      { id: 'b2', text: 'یک فعالیت لذت‌بخش کوچک را هر روز انجام دهید' },
      { id: 'b3', text: 'برنامه روزانه منظم (خواب، غذا، ورزش) تنظیم کنید' },
      { id: 'b4', text: 'با یک دوست یا عضو خانواده ارتباط اجتماعی برقرار کنید' },
    ],
  },
  {
    id: 'exposure',
    label: 'مواجهه و مدیریت اضطراب',
    items: [
      { id: 'e1', text: 'سلسله‌مراتب ترس خود را بنویسید (از کمترین تا بیشترین اضطراب)' },
      { id: 'e2', text: 'با کمترین موقعیت اضطراب‌زا روبرو شوید و ۱۵ دقیقه بمانید' },
      { id: 'e3', text: 'تکنیک زمین‌بندی: در موقعیت استرس‌زا ۵ چیز در اطرافتان نام ببرید' },
    ],
  },
  {
    id: 'reading',
    label: 'مطالعه و آموزش',
    items: [
      { id: 'r1', text: 'فصل اول کتاب تجویزشده را بخوانید و خلاصه‌ای بنویسید' },
      { id: 'r2', text: 'یک پادکست سلامت روان معرفی‌شده را گوش دهید' },
      { id: 'r3', text: 'یک ویدئو آموزشی درباره موضوع جلسه تماشا کنید' },
    ],
  },
];

const CUSTOM_STORAGE_KEY = 'ruansad_custom_homework';

function loadCustomItems(): PresetItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PresetItem[]) : [];
  } catch {
    return [];
  }
}

function saveCustomItems(items: PresetItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(items));
}

/* ─── Component ─────────────────────────────────────── */
interface HomeworkPickerFieldProps {
  value: string;
  onChange: (v: string) => void;
}

export function HomeworkPickerField({ value, onChange }: HomeworkPickerFieldProps) {
  const [fieldOpen, setFieldOpen] = useState(() => value.trim().length > 0);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [customItems, setCustomItems] = useState<PresetItem[]>([]);
  const [newCustomText, setNewCustomText] = useState('');
  const [addingCustom, setAddingCustom] = useState(false);
  const newCustomRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCustomItems(loadCustomItems());
  }, []);

  useEffect(() => {
    if (addingCustom) newCustomRef.current?.focus();
  }, [addingCustom]);

  const toggleCat = (id: string) =>
    setExpandedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const appendToField = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const current = value.trim();
    onChange(current ? `${current}\n• ${trimmed}` : `• ${trimmed}`);
    toast.success('تکلیف اضافه شد');
  };

  const saveCustom = () => {
    const trimmed = newCustomText.trim();
    if (!trimmed) return;
    const item: PresetItem = { id: `custom-${Date.now()}`, text: trimmed };
    const updated = [item, ...customItems];
    setCustomItems(updated);
    saveCustomItems(updated);
    setNewCustomText('');
    setAddingCustom(false);
    toast.success('تکلیف ذخیره شد');
  };

  const deleteCustom = (id: string) => {
    const updated = customItems.filter((c) => c.id !== id);
    setCustomItems(updated);
    saveCustomItems(updated);
  };

  return (
    <Collapsible open={fieldOpen} onOpenChange={setFieldOpen}>
      <div
        className={cn(
          'group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-shadow duration-200',
          fieldOpen
            ? 'border-primary/30 shadow-md ring-1 ring-primary/10'
            : 'hover:border-slate-300 hover:shadow-md',
        )}
      >
        {/* ── Trigger ── */}
        <CollapsibleTrigger asChild>
          <button
            type="button"
            dir="rtl"
            className={cn(
              'flex w-full select-none items-center gap-4 py-4',
              'transition-colors hover:bg-slate-50/80',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/25',
            )}
            style={{ paddingInlineStart: '1.5rem', paddingInlineEnd: '1.25rem', minHeight: '3.5rem' }}
          >
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200/90 bg-white text-slate-600 transition-colors',
                fieldOpen && 'border-primary/30 bg-primary/[0.07] text-primary',
              )}
              style={{ marginInlineStart: '0.375rem' }}
            >
              <ChevronDown
                className={cn('h-4 w-4 transition-transform duration-200', fieldOpen && '-rotate-180')}
                strokeWidth={2}
              />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1 text-right">
              <span className="text-base font-semibold leading-relaxed text-slate-900 sm:text-[1.05rem]">
                تکالیف و تمرین‌های خانگی
              </span>
              {!fieldOpen && value.trim() !== '' && (
                <span className="truncate text-xs leading-relaxed text-slate-500">{value.trim()}</span>
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <div className="border-t border-slate-100 bg-slate-50/30" style={{ padding: '1.25rem' }}>

            {/* Free-text area */}
            <Textarea
              id="homework"
              aria-label="تکالیف و تمرین‌های خانگی"
              placeholder="تمرین یا تکلیف محول‌شده... (یا از کتابخانه زیر انتخاب کنید)"
              dir="rtl"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={4}
              className={cn(
                '!w-full !resize-y !rounded-xl !border !border-slate-200 !bg-white !px-4 !py-4 !text-sm !leading-7 !text-slate-900 !shadow-none !outline-none !ring-0',
                'placeholder:!text-right placeholder:!text-slate-400',
                'focus-visible:!border-primary/50 focus-visible:!ring-2 focus-visible:!ring-primary/15',
                '!min-h-[128px]',
              )}
            />

            {/* ── Library toggle ── */}
            <button
              type="button"
              onClick={() => setLibraryOpen((p) => !p)}
              className={cn(
                'mt-3 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all',
                libraryOpen
                  ? 'border-primary/30 bg-primary/[0.04] text-primary'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary/25 hover:bg-primary/[0.02] hover:text-primary',
              )}
              dir="rtl"
            >
              <span className="flex items-center gap-2">
                <BookMarked className="h-4 w-4" />
                انتخاب از کتابخانه تکالیف
              </span>
              <ChevronDown
                className={cn('h-4 w-4 transition-transform duration-200', libraryOpen && '-rotate-180')}
              />
            </button>

            {/* ── Library panel ── */}
            {libraryOpen && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">

                {/* ─ Saved custom tasks ─ */}
                <div className="border-b border-slate-100 px-4 py-3" dir="rtl">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      تکالیف ذخیره‌شده من
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddingCustom((p) => !p)}
                      className="flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/[0.05] px-2.5 py-1 text-xs font-medium text-primary transition-all hover:bg-primary/10"
                    >
                      <Plus className="h-3 w-3" />
                      ذخیره تکلیف جدید
                    </button>
                  </div>

                  {/* Add custom input */}
                  {addingCustom && (
                    <div className="mb-2 flex gap-2" dir="rtl">
                      <input
                        ref={newCustomRef}
                        type="text"
                        value={newCustomText}
                        onChange={(e) => setNewCustomText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') { e.preventDefault(); saveCustom(); }
                          if (e.key === 'Escape') { setAddingCustom(false); setNewCustomText(''); }
                        }}
                        placeholder="متن تکلیف را بنویسید..."
                        dir="rtl"
                        className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                      />
                      <button
                        type="button"
                        onClick={saveCustom}
                        className="flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-white transition-colors hover:bg-primary/90"
                        aria-label="ذخیره"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAddingCustom(false); setNewCustomText(''); }}
                        className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-500 transition-colors hover:bg-slate-50"
                        aria-label="لغو"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {customItems.length === 0 && !addingCustom && (
                    <p className="py-2 text-right text-xs text-slate-400">
                      هنوز تکلیف ذخیره‌شده‌ای ندارید. با دکمه بالا تکالیف تکراری خود را ذخیره کنید.
                    </p>
                  )}

                  {customItems.length > 0 && (
                    <ul className="flex flex-col gap-1">
                      {customItems.map((item) => (
                        <li key={item.id} className="flex items-start gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-slate-50" dir="rtl">
                          <button
                            type="button"
                            onClick={() => appendToField(item.text)}
                            className="min-w-0 flex-1 text-right text-sm text-slate-700 hover:text-primary"
                          >
                            {item.text}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustom(item.id)}
                            className="mt-0.5 shrink-0 text-slate-300 transition-colors hover:text-red-400"
                            aria-label="حذف"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ─ Pre-defined categories ─ */}
                <div className="divide-y divide-slate-100" dir="rtl">
                  {PRESET_LIBRARY.map((cat) => (
                    <div key={cat.id}>
                      <button
                        type="button"
                        onClick={() => toggleCat(cat.id)}
                        className="flex w-full items-center justify-between px-4 py-3 text-right transition-colors hover:bg-slate-50/80"
                        dir="rtl"
                      >
                        <span className="text-sm font-semibold text-slate-700">{cat.label}</span>
                        <ChevronLeft
                          className={cn(
                            'h-4 w-4 text-slate-400 transition-transform duration-200',
                            expandedCats.includes(cat.id) && '-rotate-90',
                          )}
                        />
                      </button>

                      {expandedCats.includes(cat.id) && (
                        <ul className="flex flex-col gap-0.5 bg-slate-50/60 px-4 pb-3 pt-1" dir="rtl">
                          {cat.items.map((item) => (
                            <li key={item.id}>
                              <button
                                type="button"
                                onClick={() => appendToField(item.text)}
                                className="w-full rounded-lg px-3 py-2.5 text-right text-sm text-slate-700 transition-all hover:bg-white hover:text-primary hover:shadow-sm"
                              >
                                {item.text}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
