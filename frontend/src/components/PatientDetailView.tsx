import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { X, Brain, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Calendar, Activity, Phone, Sparkles, Target, Lightbulb, MessageCircleMore, ClipboardList } from 'lucide-react';
import styles from './PatientDetailView.module.css';

export interface Schema {
  name: string;
  severity: 'low' | 'medium' | 'high';
  frequency: number; // times detected
  lastDetected: string;
  description: string;
}

export interface BehaviorPattern {
  pattern: string;
  occurrences: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

/** مراجع تازه: فقط ارزیابی اولیه و آزمون؛ پرونده درمانی کامل هنوز باز نشده */
export type ClinicalEngagement = 'new_intake' | 'established';

export interface PatientDetail {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  /** new_intake = تازه‌وار، established = پرونده فعال / جلسات قبلی */
  clinicalEngagement: ClinicalEngagement;
  /** درمانگر اصلی مراجع برای تقسیم نوبت‌ها در تقویم اتاق‌ها (دادهٔ نمونه) */
  assignedDoctorId: string;
  status: 'safe' | 'attention' | 'urgent';
  overallScore: number; // 0-100
  schemas: Schema[];
  behaviors: BehaviorPattern[];
  monthlyMood: Array<{
    date: string;
    mood: number;
    anxiety: number;
    depression: number;
  }>;
  aiInsights: string[];
  chatbotSummary: {
    mainTopic: 'ازدواج' | 'روابط' | 'فردی' | 'اضطراب' | 'خانواده';
    confidence: number;
    notes: string;
  };
  /**
   * فقط برای `new_intake`: خلاصهٔ روایت‌گونهٔ گفت‌وگوی غربالگری با چت‌بات (نمونه).
   */
  intakeConversationSummary?: string;
  /**
   * فقط برای `new_intake`: نمونهٔ نکات استخراج‌شده از گفت‌وگوی غربالگری با چت‌بات
   * (قبل از باز شدن پروندهٔ درمانی کامل).
   */
  intakeChatHighlights?: string[];
  assessments: {
    neo: {
      neuroticism: number;
      extraversion: number;
      openness: number;
      agreeableness: number;
      conscientiousness: number;
    };
    depression: number;
    anxiety: number;
    stress: number;
  };
  sessionsCount: number;
  lastSession: string;
}

interface PatientDetailViewProps {
  patient: PatientDetail;
  onClose: () => void;
}

function generateAIAnalysis(patient: PatientDetail): {
  weeklySummary: string;
  treatmentRecommendations: string[];
  focusAreas: string[];
} {
  const moodData = patient.monthlyMood;
  const latestMood = moodData[moodData.length - 1];
  const initialMood = moodData[0];
  const moodChange = latestMood.mood - initialMood.mood;
  const anxietyLevel = latestMood.anxiety;
  const depressionLevel = latestMood.depression;
  
  // Generate weekly summary based on data
  let weeklySummary = '';
  
  if (patient.status === 'urgent') {
    weeklySummary = `بیمار در وضعیت فوری قرار دارد با امتیاز کلی ${patient.overallScore}. `;
    if (moodChange < 0) {
      weeklySummary += `طی هفته‌های اخیر روند نزولی قابل توجهی در خلق مشاهده شده است (کاهش ${Math.abs(moodChange)} واحدی). `;
    }
    if (depressionLevel > 60) {
      weeklySummary += `سطح افسردگی بالا (${depressionLevel}) نگران‌کننده است و نیاز به مداخله فوری دارد. `;
    }
    if (anxietyLevel > 60) {
      weeklySummary += `اضطراب شدید (${anxietyLevel}) مشاهده می‌شود که بر عملکرد روزمره تأثیر گذاشته است. `;
    }
    weeklySummary += `الگوهای رفتاری نشان‌دهنده نیاز به پیگیری مستمر و احتمالاً تغییر در رویکرد درمانی می‌باشد.`;
  } else if (patient.status === 'attention') {
    weeklySummary = `بیمار در وضعیت نیاز به توجه با امتیاز ${patient.overallScore} قرار دارد. `;
    if (moodChange > 0) {
      weeklySummary += `نشانه‌های بهبود تدریجی مشاهده می‌شود (افزایش ${moodChange} واحدی در خلق). `;
    } else if (moodChange < 0) {
      weeklySummary += `روند کاهشی در خلق (${Math.abs(moodChange)} واحد) نیاز به توجه بیشتر دارد. `;
    }
    if (anxietyLevel > 50) {
      weeklySummary += `سطح اضطراب (${anxietyLevel}) همچنان بالاتر از حد طبیعی است. `;
    }
    weeklySummary += `بیمار به تقویت مهارت‌های مقابله‌ای و پیگیری منظم نیاز دارد.`;
  } else {
    weeklySummary = `بیمار در وضعیت پایدار با امتیاز ${patient.overallScore} قرار دارد. `;
    if (moodChange > 0) {
      weeklySummary += `روند مثبت در بهبود خلق (افزایش ${moodChange} واحدی) مشاهده می‌شود. `;
    }
    if (anxietyLevel < 40 && depressionLevel < 40) {
      weeklySummary += `سطوح اضطراب و افسردگی در محدوده قابل قبول هستند. `;
    }
    weeklySummary += `بیمار به خوبی از تکنیک‌های یادگرفته شده استفاده می‌کند و پیشرفت قابل توجهی داشته است.`;
  }
  
  // Generate treatment recommendations based on schemas and status
  const recommendations: string[] = [];
  
  // Based on status
  if (patient.status === 'urgent') {
    recommendations.push('برگزاری جلسات با فاصله زمانی کوتاه‌تر (حداقل دو جلسه در هفته) برای پایش مستمر');
    recommendations.push('بررسی نیاز به مشاوره روان‌پزشکی جهت ارزیابی داروی کمکی');
    recommendations.push('فعال‌سازی شبکه حمایتی بیمار و هماهنگی با خانواده در صورت لزوم');
  } else if (patient.status === 'attention') {
    recommendations.push('ادامه جلسات با تناوب منظم و پایش دقیق روند درمان');
    recommendations.push('تقویت تکنیک‌های مقابله‌ای و مهارت‌های تنظیم هیجانی');
  } else {
    recommendations.push('ادامه جلسات با فاصله زمانی استاندارد و ارزیابی دوره‌ای پیشرفت');
    recommendations.push('تمرکز بر پیشگیری از عود و تقویت مهارت‌های نگهدارنده');
  }
  
  // Based on schemas
  const highSeveritySchemas = patient.schemas.filter(s => s.severity === 'high');
  if (highSeveritySchemas.length > 0) {
    const schemaNames = highSeveritySchemas.map(s => s.name).join('، ');
    recommendations.push(`کار عمیق روی طرحواره‌های شدید: ${schemaNames} با استفاده از تکنیک‌های طرحواره‌درمانی`);
    recommendations.push('استفاده از تکنیک‌های تجربی و بازسازی شناختی برای تغییر الگوهای ناکارآمد');
  }
  
  // Based on mood trend
  if (anxietyLevel > 55) {
    recommendations.push('آموزش و تمرین تکنیک‌های کاهش اضطراب (تنفس دیافراگمی، ریلکسیشن عضلانی پیشرونده)');
  }
  
  if (depressionLevel > 55) {
    recommendations.push('فعال‌سازی رفتاری و برنامه‌ریزی فعالیت‌های لذت‌بخش روزانه');
    recommendations.push('چالش افکار منفی خودکار با استفاده از ثبت افکار و تکنیک‌های شناختی');
  }
  
  // Based on behavioral patterns
  const increasingPatterns = patient.behaviors.filter(b => b.trend === 'increasing');
  if (increasingPatterns.length > 0) {
    recommendations.push('بررسی و مداخله در الگوهای رفتاری در حال افزایش جهت جلوگیری از تشدید مشکلات');
  }
  
  // Focus areas based on schemas
  const focusAreas: string[] = [];
  
  patient.schemas.forEach(schema => {
    if (schema.name.includes('رهاشدگی') || schema.name.includes('بی‌اعتمادی')) {
      if (!focusAreas.includes('تقویت رابطه درمانی و ایجاد امنیت')) {
        focusAreas.push('تقویت رابطه درمانی و ایجاد امنیت');
      }
    }
    if (schema.name.includes('محرومیت هیجانی') || schema.name.includes('انزوای اجتماعی')) {
      if (!focusAreas.includes('بهبود مهارت‌های ارتباطی و اجتماعی')) {
        focusAreas.push('بهبود مهارت‌های ارتباطی و اجتماعی');
      }
    }
    if (schema.name.includes('نقص') || schema.name.includes('شرم')) {
      if (!focusAreas.includes('کار بر روی عزت نفس و پذیرش خود')) {
        focusAreas.push('کار بر روی عزت نفس و پذیرش خود');
      }
    }
    if (schema.name.includes('شکست') || schema.name.includes('وابستگی')) {
      if (!focusAreas.includes('تقویت احساس خودکارآمدی و استقلال')) {
        focusAreas.push('تقویت احساس خودکارآمدی و استقلال');
      }
    }
    if (schema.name.includes('تسلیم') || schema.name.includes('خودقربانی')) {
      if (!focusAreas.includes('آموزش جرأت‌ورزی و قائل شدن مرزهای سالم')) {
        focusAreas.push('آموزش جرأت‌ورزی و قائل شدن مرزهای سالم');
      }
    }
    if (schema.name.includes('معیارهای سرسختانه') || schema.name.includes('تنبیه')) {
      if (!focusAreas.includes('کاهش کمال‌گرایی و افزایش انعطاف‌پذیری شناختی')) {
        focusAreas.push('کاهش کمال‌گرایی و افزایش انعطاف‌پذیری شناختی');
      }
    }
  });
  
  if (focusAreas.length === 0) {
    focusAreas.push('تقویت مهارت‌های تنظیم هیجانی');
    focusAreas.push('بهبود مهارت‌های حل مسئله');
  }
  
  return {
    weeklySummary,
    treatmentRecommendations: recommendations.slice(0, 5), // Limit to 5 recommendations
    focusAreas
  };
}

export function PatientDetailView({ patient, onClose }: PatientDetailViewProps) {
  const [chartKey, setChartKey] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Force chart to remount and replay animation when patient changes
  useEffect(() => {
    setChartKey(prev => prev + 1);
    
    // Apply line drawing animation to SVG paths after render
    const applyAnimation = () => {
      if (chartRef.current) {
        const paths = chartRef.current.querySelectorAll('.recharts-line-curve');
        
        if (paths.length > 0) {
          paths.forEach((path, index) => {
            const pathElement = path as SVGPathElement;
            const length = pathElement.getTotalLength();
            
            // Clear any existing animation first
            pathElement.style.animation = '';
            pathElement.style.strokeDasharray = '';
            pathElement.style.strokeDashoffset = '';
            pathElement.style.opacity = '1';
            
            // Force reflow
            void pathElement.getBoundingClientRect();
            
            // Set up the line to be fully hidden at start
            pathElement.style.strokeDasharray = `${length} ${length}`;
            pathElement.style.strokeDashoffset = `${length}`;
            pathElement.style.opacity = '1';
            
            // Force another reflow
            void pathElement.getBoundingClientRect();
            
            // Apply smooth drawing animation (faster)
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                pathElement.style.transition = `stroke-dashoffset ${1 + index * 0.05}s ease-in-out ${index * 0.15}s`;
                pathElement.style.strokeDashoffset = '0';
              });
            });
          });
        } else {
          // Retry if paths not found yet
          setTimeout(applyAnimation, 50);
        }
      }
    };
    
    // Wait for chart to fully render, then apply animation
    const timer = setTimeout(applyAnimation, 100);
    
    return () => clearTimeout(timer);
  }, [patient.id]);

  const statusConfig = {
    safe: { color: '#6fcf97', label: 'وضعیت پایدار' },
    attention: { color: '#f2c94c', label: 'نیاز به توجه' },
    urgent: { color: '#eb5757', label: 'وضعیت فوری' }
  };

  const severityConfig = {
    low: { color: '#6fcf97', label: 'خفیف', className: styles.severityLow },
    medium: { color: '#f2c94c', label: 'متوسط', className: styles.severityMedium },
    high: { color: '#eb5757', label: 'شدید', className: styles.severityHigh }
  };

      const config = statusConfig[patient.status];
      const aiAnalysis = generateAIAnalysis(patient);

      return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.overlay}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={styles.modal}
        dir="rtl"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div 
                className={styles.headerIcon}
                style={{ background: `linear-gradient(to bottom right, ${config.color}, ${config.color}dd)` }}
              >
                <Brain />
              </div>
              <div className={styles.headerInfo}>
                <h2>{patient.name}</h2>
                <div className={styles.headerMeta}>
                  <span>{patient.age} ساله</span>
                  <span>•</span>
                  <span>{patient.gender}</span>
                  <span>•</span>
                  <span>{patient.sessionsCount} جلسه</span>
                </div>
                <div className={styles.headerTags}>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: config.color }}
                  >
                    {config.label}
                  </span>
                  <span className={styles.lastSession}>
                    آخرین جلسه: {patient.lastSession}
                  </span>
                  <a
                    href={`tel:${patient.phone.replace(/[^\d+]/g, '')}`}
                    className={styles.phoneLink}
                    dir="ltr"
                  >
                    <span>{patient.phone}</span>
                    <Phone />
                  </a>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={styles.closeButton}
            >
              <X />
            </button>
          </div>

          {/* Overall Score */}
          <div className={styles.scoreSection}>
            <div className={styles.scoreHeader}>
              <span className={styles.scoreLabel}>امتیاز کلی سلامت روان</span>
              <span className={styles.scoreValue}>{patient.overallScore}/100</span>
            </div>
            <div className={styles.scoreBar}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${patient.overallScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={styles.scoreBarFill}
                style={{ 
                  background: `linear-gradient(to right, ${
                    patient.overallScore > 70 ? '#6fcf97' : 
                    patient.overallScore > 40 ? '#f2c94c' : '#eb5757'
                  }, ${
                    patient.overallScore > 70 ? '#5fb587' : 
                    patient.overallScore > 40 ? '#e0b73c' : '#d84747'
                  })` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Monthly Mood Trend */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Calendar />
              <h3 className={styles.sectionTitle}>روند خلقی ماهانه</h3>
            </div>
              <div className={styles.chartContainer}>
                <div className={styles.chartWrapper} ref={chartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={patient.monthlyMood} 
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      key={chartKey}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6B7280"
                        style={{ fontFamily: 'inherit', fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#6B7280"
                        style={{ fontFamily: 'inherit', fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.98)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '12px',
                          padding: '12px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          fontFamily: 'inherit',
                          direction: 'rtl'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        dot={{ fill: '#8B5CF6', r: 4 }}
                        name="خلق"
                        isAnimationActive={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="anxiety" 
                        stroke="#f2c94c" 
                        strokeWidth={2}
                        dot={{ fill: '#f2c94c', r: 3 }}
                        name="اضطراب"
                        isAnimationActive={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="depression" 
                        stroke="#eb5757" 
                        strokeWidth={2}
                        dot={{ fill: '#eb5757', r: 3 }}
                        name="افسردگی"
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
          </section>

          {/* Detected Schemas */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Brain />
              <h3 className={styles.sectionTitle}>طرحواره‌های شناسایی شده</h3>
            </div>
            <div className={styles.schemasGrid}>
              {patient.schemas.map((schema, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.schemaCard}
                >
                  <div className={styles.schemaHeader}>
                    <div className={styles.schemaInfo}>
                      <h4 className={styles.schemaName}>{schema.name}</h4>
                      <p className={styles.schemaDescription}>{schema.description}</p>
                    </div>
                    <span
                      className={`${styles.severityBadge} ${severityConfig[schema.severity].className}`}
                    >
                      {severityConfig[schema.severity].label}
                    </span>
                  </div>
                  <div className={styles.schemaMeta}>
                    <div className={styles.schemaMetaItem}>
                      <Activity />
                      <span>{schema.frequency} بار تکرار</span>
                    </div>
                    <div className={styles.schemaMetaItem}>
                      <Calendar />
                      <span>آخرین: {schema.lastDetected}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Behavioral Patterns */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Activity />
              <h3 className={styles.sectionTitle}>الگوهای رفتاری</h3>
            </div>
            <div className={styles.behaviorsContainer}>
              <div className={styles.behaviorsList}>
                {patient.behaviors.map((behavior, index) => (
                  <div key={index} className={styles.behaviorItem}>
                    <div className={styles.behaviorInfo}>
                      <p className={styles.behaviorPattern}>{behavior.pattern}</p>
                      <div className={styles.behaviorTrend}>
                        {behavior.trend === 'increasing' ? (
                          <>
                            <TrendingUp className={styles.trendUp} />
                            <span className={styles.trendUp}>در حال افزایش</span>
                          </>
                        ) : behavior.trend === 'decreasing' ? (
                          <>
                            <TrendingDown className={styles.trendDown} />
                            <span className={styles.trendDown}>در حال کاهش</span>
                          </>
                        ) : (
                          <>
                            <span className={styles.trendStable}></span>
                            <span style={{ color: '#f2c94c' }}>ثابت</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className={styles.behaviorCount}>
                      <div className={styles.behaviorCountValue}>{behavior.occurrences}</div>
                      <div className={styles.behaviorCountLabel}>مورد</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Analysis & Recommendations */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Sparkles />
              <h3 className={styles.sectionTitle}>تحلیل هوش مصنوعی و پیشنهادات درمانی</h3>
            </div>
            
            {/* Weekly Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.aiSummaryCard}
            >
              <div className={styles.aiSummaryHeader}>
                <div className={styles.aiSummaryIcon}>
                  <Brain />
                </div>
                <div className={styles.aiSummaryContent}>
                  <h4 className={styles.aiSummaryTitle}>
                    خلاصه وضعیت هفتگی
                  </h4>
                  <p className={styles.aiSummaryText}>
                    {aiAnalysis.weeklySummary}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Treatment Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.recommendationsCard}
            >
              <div className={styles.recommendationsHeader}>
                <div className={styles.recommendationsIcon}>
                  <Target />
                </div>
                <h4 className={styles.recommendationsTitle}>پیشنهادات درمانی</h4>
              </div>
              <ul className={styles.recommendationsList}>
                {aiAnalysis.treatmentRecommendations.map((recommendation, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className={styles.recommendationItem}
                  >
                    <CheckCircle />
                    <p className={styles.recommendationText}>{recommendation}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Focus Areas */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.focusAreasCard}
            >
              <div className={styles.focusAreasHeader}>
                <div className={styles.focusAreasIcon}>
                  <Lightbulb />
                </div>
                <h4 className={styles.focusAreasTitle}>نقاط تمرکز در جلسات آتی</h4>
              </div>
              <div className={styles.focusAreasList}>
                {aiAnalysis.focusAreas.map((area, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={styles.focusAreaTag}
                  >
                    {area}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <MessageCircleMore />
              <h3 className={styles.sectionTitle}>خلاصه نتیجه گفت‌وگو با چت‌بات</h3>
            </div>
            <div className={styles.aiSummaryCard}>
              <p className={styles.aiSummaryText}>
                موضوع غالب: <strong>{patient.chatbotSummary.mainTopic}</strong> (ضریب اطمینان: {patient.chatbotSummary.confidence}%)
              </p>
              <p className={styles.aiSummaryText}>{patient.chatbotSummary.notes}</p>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <ClipboardList />
              <h3 className={styles.sectionTitle}>نتایج آزمون‌ها (NEO و سایر تست‌ها)</h3>
            </div>
            <div className={styles.recommendationsCard}>
              <ul className={styles.recommendationsList}>
                <li className={styles.recommendationItem}><CheckCircle /><p className={styles.recommendationText}>NEO - روان‌رنجوری: {patient.assessments.neo.neuroticism}</p></li>
                <li className={styles.recommendationItem}><CheckCircle /><p className={styles.recommendationText}>NEO - برون‌گرایی: {patient.assessments.neo.extraversion}</p></li>
                <li className={styles.recommendationItem}><CheckCircle /><p className={styles.recommendationText}>NEO - گشودگی: {patient.assessments.neo.openness}</p></li>
                <li className={styles.recommendationItem}><CheckCircle /><p className={styles.recommendationText}>NEO - توافق‌پذیری: {patient.assessments.neo.agreeableness}</p></li>
                <li className={styles.recommendationItem}><CheckCircle /><p className={styles.recommendationText}>NEO - وظیفه‌شناسی: {patient.assessments.neo.conscientiousness}</p></li>
                <li className={styles.recommendationItem}><CheckCircle /><p className={styles.recommendationText}>افسردگی: {patient.assessments.depression} | اضطراب: {patient.assessments.anxiety} | استرس: {patient.assessments.stress}</p></li>
              </ul>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
