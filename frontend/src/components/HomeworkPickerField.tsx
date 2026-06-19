'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, BookMarked, Plus, Trash2, Check, X, ChevronLeft, ClipboardList, CirclePlus } from 'lucide-react';
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

function normalizeHomeworkText(text: string): string {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

function parseHomeworkItems(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith('•') ? line.replace(/^•\s*/, '') : line).trim())
    .filter(Boolean);
}

function formatHomeworkItems(items: string[]): string {
  return items.map((item) => `• ${item}`).join('\n');
}

function isHomeworkAlreadySelected(value: string, text: string): boolean {
  const target = normalizeHomeworkText(text);
  return parseHomeworkItems(value).some((item) => normalizeHomeworkText(item) === target);
}

function LibraryItemRow({
  text,
  selected,
  onSelect,
  onDelete,
  deleteLabel,
}: {
  text: string;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
}) {
  return (
    <div
      className={cn(
        'group flex items-center gap-1 rounded-xl border transition-all',
        selected
          ? 'border-primary/15 bg-primary/[0.04]'
          : 'border-transparent hover:border-slate-200 hover:bg-slate-50',
      )}
      dir="rtl"
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={selected}
        className={cn(
          'flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3.5 text-right text-sm transition-colors',
          selected ? 'cursor-default text-slate-500' : 'text-slate-700 hover:text-primary',
        )}
      >
        <span className="min-w-0 flex-1 leading-6">{text}</span>
        {selected ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
            <Check className="h-3 w-3" />
            انتخاب شده
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/15 bg-white px-3 py-1.5 text-xs font-medium text-primary sm:border-transparent sm:bg-primary/10 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
            <Plus className="h-3.5 w-3.5" />
            افزودن
          </span>
        )}
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="me-1 shrink-0 rounded-lg p-2.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label={deleteLabel ?? 'حذف'}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
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
  const [manualText, setManualText] = useState('');
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

  const selectedItems = parseHomeworkItems(value);

  const appendToField = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (isHomeworkAlreadySelected(value, trimmed)) {
      toast.info('این تکلیف قبلاً انتخاب شده است');
      return;
    }
    onChange(formatHomeworkItems([...selectedItems, trimmed]));
    toast.success('تکلیف اضافه شد');
  };

  const removeFromField = (index: number) => {
    const updated = selectedItems.filter((_, i) => i !== index);
    onChange(formatHomeworkItems(updated));
  };

  const addManualItem = () => {
    appendToField(manualText);
    setManualText('');
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
            <div className="flex min-w-0 flex-1 flex-col items-start gap-1 text-right">
              <div className="flex w-full flex-wrap items-center justify-start gap-2">
                <span className="text-base font-semibold leading-relaxed text-slate-900 sm:text-[1.05rem]">
                  تکالیف و تمرین‌های خانگی
                </span>
                {!fieldOpen && selectedItems.length > 0 && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {selectedItems.length} تکلیف
                  </span>
                )}
              </div>
              {!fieldOpen && selectedItems.length > 0 && (
                <span className="w-full truncate text-right text-xs leading-relaxed text-slate-500">
                  {selectedItems[0]}
                  {selectedItems.length > 1 ? ` و ${selectedItems.length - 1} مورد دیگر` : ''}
                </span>
              )}
              {!fieldOpen && value.trim() !== '' && selectedItems.length === 0 && (
                <span className="w-full truncate text-right text-xs leading-relaxed text-slate-500">{value.trim()}</span>
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <div className="flex flex-col gap-10 border-t border-slate-100 bg-slate-50/30 px-5 py-6 sm:px-6 sm:py-7">

            {/* Selected homework list */}
            <div
              className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm"
              dir="rtl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-7 sm:py-[1.375rem]">
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ClipboardList className="h-4 w-4" />
                  </span>
                  <div className="flex min-w-0 flex-col gap-1.5 text-right">
                    <p className="text-sm font-semibold leading-6 text-slate-800">تکالیف این جلسه</p>
                    <p className="text-[11px] leading-4 text-slate-400/90">
                      {selectedItems.length > 0
                        ? `${selectedItems.length} مورد انتخاب شده`
                        : 'هنوز تکلیفی اضافه نشده'}
                    </p>
                  </div>
                </div>
                {selectedItems.length > 0 && (
                  <span className="shrink-0 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5 text-xs font-semibold text-primary">
                    {selectedItems.length}
                  </span>
                )}
              </div>

              {selectedItems.length > 0 && (
                <ul className="divide-y divide-slate-100">
                  {selectedItems.map((item, index) => (
                    <li
                      key={`${index}-${item.slice(0, 32)}`}
                      className="group flex items-start gap-4 px-5 py-4 sm:px-6 transition-colors hover:bg-slate-50/60"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {index + 1}
                      </span>
                      <p className="min-w-0 flex-1 pt-0.5 text-right text-sm leading-7 text-slate-700">
                        {item}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromField(index)}
                        className="mt-0.5 shrink-0 rounded-lg border border-transparent p-2 text-slate-400 opacity-70 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                        aria-label={`حذف تکلیف: ${item}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Manual add */}
              <div
                className={cn(
                  'bg-slate-50/40 px-6 py-6 sm:px-7 sm:py-7',
                  selectedItems.length > 0 && 'border-t border-slate-100',
                )}
              >
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="homework-manual"
                    className="block px-0.5 text-right text-xs font-semibold leading-5 text-slate-500"
                  >
                    افزودن تکلیف دستی
                  </label>
                  <div className="flex gap-3" dir="rtl">
                  <input
                    id="homework-manual"
                    type="text"
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addManualItem();
                      }
                    }}
                    placeholder="متن تکلیف را بنویسید..."
                    dir="rtl"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={addManualItem}
                    disabled={!manualText.trim()}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <CirclePlus className="h-4 w-4" />
                    افزودن
                  </button>
                </div>
                </div>
              </div>
            </div>

            {/* Hidden field for form accessibility / legacy free text */}
            <Textarea
              id="homework"
              aria-label="تکالیف و تمرین‌های خانگی"
              value={value}
              readOnly
              tabIndex={-1}
              className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
            />

            {/* ── Library section ── */}
            <div className="flex flex-col gap-5 pt-2">
            <button
              type="button"
              onClick={() => setLibraryOpen((p) => !p)}
              className={cn(
                'flex w-full min-h-[5.25rem] items-center justify-between gap-4 rounded-xl border px-6 py-5 sm:px-7 sm:py-5 text-sm font-medium transition-all',
                libraryOpen
                  ? 'border-primary/30 bg-primary/[0.04] text-primary shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary/25 hover:bg-primary/[0.02] hover:text-primary',
              )}
              dir="rtl"
            >
              <span className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookMarked className="h-5 w-5 shrink-0" />
                </span>
                <span className="min-w-0 flex-1 py-0.5 text-right">
                  <span className="block text-[0.9375rem] font-semibold leading-6 text-inherit sm:text-base">
                    کتابخانه تکالیف
                  </span>
                  <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">
                    انتخاب از الگوهای آماده و تکالیف ذخیره‌شده
                  </span>
                </span>
              </span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200',
                  libraryOpen && '-rotate-180 text-primary',
                )}
              />
            </button>

            {/* ── Library panel ── */}
            {libraryOpen && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                {/* ─ Saved custom tasks ─ */}
                <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-5 sm:px-6" dir="rtl">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-700">تکالیف ذخیره‌شده من</span>
                    <button
                      type="button"
                      onClick={() => setAddingCustom((p) => !p)}
                      className="flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm transition-all hover:border-primary/35 hover:bg-primary/[0.04]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      تکلیف جدید
                    </button>
                  </div>

                  {/* Add custom input */}
                  {addingCustom && (
                    <div className="mb-3 flex gap-3" dir="rtl">
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
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                      />
                      <button
                        type="button"
                        onClick={saveCustom}
                        className="flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-white transition-colors hover:bg-primary/90"
                        aria-label="ذخیره"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAddingCustom(false); setNewCustomText(''); }}
                        className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-500 transition-colors hover:bg-slate-50"
                        aria-label="لغو"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {customItems.length === 0 && !addingCustom && (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-5 text-center text-xs leading-7 text-slate-400">
                      تکالیف پرتکرار خود را ذخیره کنید تا در جلسات بعد سریع‌تر انتخاب کنید.
                    </p>
                  )}

                  {customItems.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {customItems.map((item) => (
                        <li key={item.id}>
                          <LibraryItemRow
                            text={item.text}
                            selected={isHomeworkAlreadySelected(value, item.text)}
                            onSelect={() => appendToField(item.text)}
                            onDelete={() => deleteCustom(item.id)}
                            deleteLabel="حذف از کتابخانه"
                          />
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
                        className="flex w-full items-center justify-between px-5 py-4 sm:px-6 text-right transition-colors hover:bg-slate-50/80"
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
                        <ul className="flex flex-col gap-2 bg-slate-50/60 px-4 pb-4 pt-2 sm:px-5" dir="rtl">
                          {cat.items.map((item) => (
                            <li key={item.id}>
                              <LibraryItemRow
                                text={item.text}
                                selected={isHomeworkAlreadySelected(value, item.text)}
                                onSelect={() => appendToField(item.text)}
                              />
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
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
