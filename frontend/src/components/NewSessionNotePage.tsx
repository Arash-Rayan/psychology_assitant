import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, ChevronDown, ChevronLeft, Mic, Upload, FileImage, Save, X, Type, Volume2, Image as ImageIcon } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
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

interface NewSessionNotePageProps {
  patientName: string;
  onClose: () => void;
}

export default function NewSessionNotePage({ patientName, onClose }: NewSessionNotePageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [inputMethod, setInputMethod] = useState<'type' | 'voice' | 'image'>('type');
  const [isRecording, setIsRecording] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    duration: '',
    mood: '',
    summary: '',
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

  const handleSave = () => {
    toast.success('یادداشت جلسه با موفقیت ذخیره شد');
    onClose();
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-b from-[#F5F3FF] to-white" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl text-foreground">افزودن یادداشت جلسه جدید</h1>
                <p className="text-sm text-muted-foreground mt-1">مراجع: {patientName}</p>
              </div>
            </div>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Right Side - Checklist Categories */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-xl text-foreground mb-4">دسته‌بندی موضوعات جلسه</h2>
              <p className="text-sm text-muted-foreground mb-6">
                موضوعات مطرح شده در جلسه را از لیست زیر انتخاب کنید
              </p>

              <div className="space-y-3" dir="rtl">
                {formCategories.map((category) => (
                  <div key={category.id} className="border border-border rounded-xl overflow-hidden">
                    {/* Category Header */}
                    <div
                      className="flex items-center justify-between p-4 bg-gradient-to-l from-primary/5 to-transparent cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategorySelect(category.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-foreground">{category.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          expandedCategories.includes(category.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {/* Subcategories */}
                    {expandedCategories.includes(category.id) && (
                      <div className="p-4 pt-0 space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="mr-6">
                            {/* Subcategory Header */}
                            <div
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                              onClick={() => toggleSubcategory(subcategory.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selectedSubcategories.includes(subcategory.id)}
                                  onCheckedChange={() => handleSubcategorySelect(subcategory.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="text-sm text-foreground">{subcategory.title}</span>
                              </div>
                              <ChevronLeft
                                className={`w-4 h-4 text-muted-foreground transition-transform ${
                                  expandedSubcategories.includes(subcategory.id) ? '-rotate-90' : ''
                                }`}
                              />
                            </div>

                            {/* Items */}
                            {expandedSubcategories.includes(subcategory.id) && (
                              <div className="mr-8 mt-2 space-y-2">
                                {subcategory.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/30 cursor-pointer transition-colors"
                                    onClick={() => handleItemSelect(item.id)}
                                  >
                                    <Checkbox
                                      checked={selectedItems.includes(item.id)}
                                      onCheckedChange={() => handleItemSelect(item.id)}
                                    />
                                    <span className="text-sm text-muted-foreground">{item.title}</span>
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
          </div>

          {/* Left Side - Session Details & Input Methods */}
          <div className="space-y-6">
            {/* Basic Session Info */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-xl text-foreground mb-6">اطلاعات اولیه جلسه</h2>
              
              <div className="space-y-4" dir="rtl">
                <div>
                  <Label htmlFor="date" className="text-right block mb-2">تاریخ جلسه</Label>
                  <Input
                    id="date"
                    type="text"
                    placeholder="مثال: ۱۴۰۴/۸/۱۵"
                    dir="rtl"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="duration" className="text-right block mb-2">مدت جلسه</Label>
                  <Input
                    id="duration"
                    type="text"
                    placeholder="مثال: ۴۵ دقیقه"
                    dir="rtl"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="mood" className="text-right block mb-2">حال عمومی مراجع</Label>
                  <Input
                    id="mood"
                    type="text"
                    placeholder="مثال: آرام، مضطرب، خوشحال"
                    dir="rtl"
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Input Method Selection */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-xl text-foreground mb-4">روش ثبت یادداشت</h2>
              <p className="text-sm text-muted-foreground mb-6">
                روش دلخواه خود را برای ثبت جزئیات جلسه انتخاب کنید
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6" dir="rtl">
                <button
                  onClick={() => setInputMethod('type')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    inputMethod === 'type'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/30 text-muted-foreground'
                  }`}
                >
                  <Type className="w-6 h-6" />
                  <span className="text-sm">تایپ متن</span>
                </button>

                <button
                  onClick={() => setInputMethod('voice')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    inputMethod === 'voice'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/30 text-muted-foreground'
                  }`}
                >
                  <Volume2 className="w-6 h-6" />
                  <span className="text-sm">ضبط صدا</span>
                </button>

                <button
                  onClick={() => setInputMethod('image')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    inputMethod === 'image'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/30 text-muted-foreground'
                  }`}
                >
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-sm">تصویر دست‌نوشته</span>
                </button>
              </div>

              {/* Type Method */}
              {inputMethod === 'type' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                  dir="rtl"
                >
                  <div>
                    <Label htmlFor="summary" className="text-right block mb-2">خلاصه جلسه</Label>
                    <Textarea
                      id="summary"
                      placeholder="توضیحات کامل درباره آنچه در جلسه اتفاق افتاد..."
                      dir="rtl"
                      rows={4}
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="homework" className="text-right block mb-2">تکالیف خانگی</Label>
                    <Textarea
                      id="homework"
                      placeholder="تکالیف و تمریناتی که به مراجع داده شده..."
                      dir="rtl"
                      rows={3}
                      value={formData.homework}
                      onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="goals" className="text-right block mb-2">اهداف جلسه بعد</Label>
                    <Textarea
                      id="goals"
                      placeholder="اهدافی که برای جلسه آینده برنامه‌ریزی شده..."
                      dir="rtl"
                      rows={3}
                      value={formData.nextSessionGoals}
                      onChange={(e) => setFormData({ ...formData, nextSessionGoals: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}

              {/* Voice Recording Method */}
              {inputMethod === 'voice' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                  dir="rtl"
                >
                  <div className="flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-b from-primary/5 to-transparent rounded-xl border-2 border-dashed border-primary/30">
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
                  className="space-y-4"
                  dir="rtl"
                >
                  <div 
                    onClick={handleImageUpload}
                    className="flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-b from-secondary/20 to-transparent rounded-xl border-2 border-dashed border-secondary hover:border-primary transition-all cursor-pointer group"
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
          </div>
        </div>
      </div>
    </div>
  );
}
