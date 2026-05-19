import { useState, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, TrendingUp, AlertCircle, Activity, Brain, Network, X, 
  FileText, LayoutDashboard, ClipboardList, HeartPulse, UserCheck, 
  Calendar, Download, Plus, Search, Filter, ChevronRight, Target,
  Stethoscope, MessageSquare, BarChart3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PatientCard, Patient } from './PatientCard';
import { PatientDetailView, PatientDetail } from './PatientDetailView';
import { NewIntakePatientView } from './NewIntakePatientView';
import { PatientsOverviewChart } from './PatientsOverviewChart';
import { UrgentPatientsPanel } from './UrgentPatientsPanel';
import { SCHEMA_TYPES, SCHEMA_TYPE_KEYS, SchemaType } from './SchemaTypes';
import { generatePatients } from './generatePatientData';
import { patientDetailToPatient } from '@/utils/patientDetailToPatient';
import { FormBuilderDialog } from './FormBuilderDialog';
import { SessionNotesView } from './SessionNotesView';
import { ClinicManagementView } from './ClinicManagementView';
import styles from './TherapistDashboard.module.css';

interface TherapistDashboardProps {
  initialTab?: 'patients' | 'forms' | 'clinic-management';
  initialShowSessionNotes?: boolean;
}

export function TherapistDashboard({
  initialTab = 'patients',
  initialShowSessionNotes = false,
}: TherapistDashboardProps) {
  const router = useRouter();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showUrgentPanel, setShowUrgentPanel] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'safe' | 'attention' | 'urgent'>('all');
  const [filterSchema, setFilterSchema] = useState<SchemaType | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'patients' | 'forms' | 'clinic-management'>(initialTab);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [showSessionNotes, setShowSessionNotes] = useState(initialShowSessionNotes);
  const patientsListRef = useRef<HTMLDivElement>(null);

  // Generate 100 patients (client-side only to avoid hydration mismatch)
  const [patientsData, setPatientsData] = useState<PatientDetail[]>([]);
  
  /** دادهٔ شبیه‌سازی با seed ثابت؛ هر بار ورود به این صفحه همان idها ↔ همان نام و نوع مراجع (جدید/پرونده). */
  useEffect(() => {
    setPatientsData(generatePatients(100));
  }, []);

  /** نمای کلی داشبورد: فقط مراجع با پروندهٔ قبلی؛ مراجع جدید (ورودی) اینجا نیستند. */
  const establishedPatientsData = useMemo(
    () => patientsData.filter((p) => p.clinicalEngagement === 'established'),
    [patientsData],
  );

  const patients: Patient[] = useMemo(
    () => establishedPatientsData.map(patientDetailToPatient),
    [establishedPatientsData],
  );

  const chartData = useMemo(
    () =>
      establishedPatientsData.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.overallScore,
        anxiety: p.monthlyMood[p.monthlyMood.length - 1].anxiety,
        status: p.status,
      })),
    [establishedPatientsData],
  );

  const urgentPatientsData = useMemo(
    () =>
      establishedPatientsData
        .filter((p) => p.status === 'urgent')
        .map((p) => ({
          id: p.id,
          name: p.name,
          score: p.overallScore,
          reason: p.aiInsights[0],
          lastContact: p.lastSession,
          phone: p.phone,
          priority: p.overallScore < 35 ? ('critical' as const) : ('high' as const),
        })),
    [establishedPatientsData],
  );

  const averageScore = useMemo(() => {
    if (!establishedPatientsData.length) return 0;
    return Math.round(
      establishedPatientsData.reduce((sum, p) => sum + p.overallScore, 0) /
        establishedPatientsData.length,
    );
  }, [establishedPatientsData]);

  // Filter by status AND/OR schema (simultaneous filtering)
  let filteredPatients = patients;
  
  // Apply status filter
  if (filterStatus !== 'all') {
    filteredPatients = filteredPatients.filter(p => p.status === filterStatus);
  }
  
  // Apply schema filter
  if (filterSchema !== 'all') {
    filteredPatients = filteredPatients.filter(p => {
      const patientDetail = patientsData.find(pd => pd.id === p.id);
      return patientDetail?.schemas.some(s => s.name === filterSchema);
    });
  }

  const selectedPatient = patientsData.find(p => p.id === selectedPatientId);

  const establishedPatientsForNotes = useMemo((): Patient[] => {
    return establishedPatientsData.map(patientDetailToPatient);
  }, [establishedPatientsData]);

  const openEstablishedPatientNotes = (patientId: string) => {
    router.push(`/dashboard/forms/patients/${encodeURIComponent(patientId)}`);
  };

  const handleClinicCalendarPatientClick = (patientId: string) => {
    const p = patientsData.find((x) => x.id === patientId);
    if (!p) return;
    if (p.clinicalEngagement === 'new_intake') {
      setSelectedPatientId(patientId);
    } else {
      openEstablishedPatientNotes(patientId);
    }
  };

  const handleStatClick = (status: 'all' | 'safe' | 'attention' | 'urgent') => {
    setFilterStatus(status);
    
    // Scroll to patients list with a slight delay to allow state update
    setTimeout(() => {
      patientsListRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const getStatCardClass = (index: number) => {
    if (index === 0) return styles.statCardPrimary;
    if (index === 1) return styles.statCardSafe;
    if (index === 2) return styles.statCardAttention;
    return styles.statCardUrgent;
  };

  const getStatIconClass = (index: number) => {
    if (index === 0) return styles.statIconPrimary;
    if (index === 1) return styles.statIconSafe;
    if (index === 2) return styles.statIconAttention;
    return styles.statIconUrgent;
  };

  const getStatHoverClass = (index: number) => {
    if (index === 0) return styles.statHoverEffectPrimary;
    if (index === 1) return styles.statHoverEffectSafe;
    if (index === 2) return styles.statHoverEffectAttention;
    return styles.statHoverEffectUrgent;
  };

  const stats = [
    {
      icon: Users,
      label: 'کل بیماران',
      value: patients.length,
      onClick: () => handleStatClick('all')
    },
    {
      icon: TrendingUp,
      label: 'وضعیت پایدار',
      value: patients.filter(p => p.status === 'safe').length,
      onClick: () => handleStatClick('safe')
    },
    {
      icon: AlertCircle,
      label: 'نیاز به توجه',
      value: patients.filter(p => p.status === 'attention').length,
      onClick: () => handleStatClick('attention')
    },
    {
      icon: Activity,
      label: 'وضعیت فوری',
      value: patients.filter(p => p.status === 'urgent').length,
      onClick: () => handleStatClick('urgent')
    }
  ];

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.content}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <div className={styles.headerLeft}>
            <div>
              <h1 className={styles.headerTitle}>پنل درمانگر</h1>
              <p className={styles.headerSubtitle}>
                {activeTab === 'patients'
                  ? 'تحلیل جامع و پیشرفته بیماران'
                  : activeTab === 'forms'
                  ? 'مدیریت فرم‌ها و ارزیابی‌ها'
                  : 'زمان‌بندی جلسات و پایش نتایج چت‌بات و آزمون‌ها'}
              </p>
            </div>
            
            {/* Navigation Buttons */}
            <div className={styles.navButtons}>
              <button
                onClick={() => router.push('/dashboard/forms')}
                className={`${styles.navButton} ${
                  activeTab === 'forms' ? styles.navButtonActiveForms : styles.navButtonInactive
                }`}
              >
                <FileText />
                <span>فرم درمانگر</span>
              </button>

              <button
                onClick={() => router.push('/dashboard/clinic-management')}
                className={`${styles.navButton} ${
                  activeTab === 'clinic-management' ? styles.navButtonActiveClinic : styles.navButtonInactive
                }`}
              >
                <Calendar />
                <span>مدیریت کلینیک</span>
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className={`${styles.navButton} ${
                  activeTab === 'patients' ? styles.navButtonActive : styles.navButtonInactive
                }`}
              >
                <LayoutDashboard />
                <span>داشبورد مراجعین</span>
              </button>
            </div>
          </div>
          
          <div className={styles.aiBadge}>
            <Brain />
            <span className={styles.aiBadgeText}>تحلیل هوش مصنوعی فعال</span>
          </div>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={(v) =>
              setActiveTab(v as 'patients' | 'forms' | 'clinic-management')
            }
            className={styles.tabsWrapper}
          >
            {/* TabsList hidden since we have navigation buttons in header */}
            <div className={styles.srOnly}>
              <TabsList>
                <TabsTrigger value="patients">داشبورد مراجعین</TabsTrigger>
                <TabsTrigger value="forms">فرم‌های درمانگر</TabsTrigger>
                <TabsTrigger value="clinic-management">مدیریت کلینیک</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="patients" className={styles.tabsContent}>
              {/* Stats Cards */}
              <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={stat.onClick}
                    className={`${styles.statCard} ${getStatCardClass(index)}`}
                  >
                    <div className={styles.statContent}>
                      <div className={styles.statHeader}>
                        <div className={`${styles.statIcon} ${getStatIconClass(index)}`}>
                          <stat.icon />
                        </div>
                        <span className={styles.statValue}>{stat.value}</span>
                      </div>
                      <p className={styles.statLabel}>{stat.label}</p>
                    </div>
                    {/* Hover Effect */}
                    <div className={`${styles.statHoverEffect} ${getStatHoverClass(index)}`} />
                  </motion.div>
                ))}
              </div>

              {/* Patients Overview Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={styles.chartCard}
              >
                <PatientsOverviewChart
                  patients={chartData}
                  onPatientClick={setSelectedPatientId}
                  averageScore={averageScore}
                />
              </motion.div>

              {/* Patients List */}
              <motion.div
                ref={patientsListRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={styles.patientsSection}
              >
                <div className={styles.patientsHeader}>
                  <h2 className={styles.patientsTitle}>
                    <Users />
                    لیست بیماران
                  </h2>
                  <div className={styles.filtersContainer}>
                    {/* Status Filter */}
                    <div className={styles.filterGroup} dir="rtl">
                      <Activity />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className={styles.filterSelect}
                        dir="rtl"
                      >
                        <option value="all">همه وضعیت‌ها</option>
                        <option value="safe">ایمن</option>
                        <option value="attention">نیاز به توجه</option>
                        <option value="urgent">فوری</option>
                      </select>
                    </div>

                    {/* Schema Filter */}
                    <div className={styles.filterGroup} dir="rtl">
                      <Network />
                      <select
                        value={filterSchema}
                        onChange={(e) => setFilterSchema(e.target.value as any)}
                        className={styles.filterSelect}
                        dir="rtl"
                      >
                        <option value="all">همه طرحواره‌ها</option>
                        {SCHEMA_TYPE_KEYS.map(schemaType => {
                          const count = patients.filter(p => {
                            const patientDetail = patientsData.find(pd => pd.id === p.id);
                            return patientDetail?.schemas.some(s => s.name === schemaType);
                          }).length;
                          return (
                            <option key={schemaType} value={schemaType}>
                              {schemaType} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Active Filters Display */}
                    {(filterStatus !== 'all' || filterSchema !== 'all') && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={styles.activeFilters}
                      >
                        <Filter />
                        <span className={styles.activeFiltersText}>
                          {filteredPatients.length} بیمار
                        </span>
                        <button
                          onClick={() => {
                            setFilterStatus('all');
                            setFilterSchema('all');
                          }}
                          className={styles.clearFilterButton}
                        >
                          <X />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Display Filtered Patients */}
                <div className={styles.patientsGrid}>
                  <AnimatePresence mode="popLayout">
                    {filteredPatients.map((patient, index) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.02 }}
                        layout
                      >
                        <PatientCard
                          patient={patient}
                          onClick={() => setSelectedPatientId(patient.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* No Results Message */}
                {filteredPatients.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.noResults}
                  >
                    <div className={styles.noResultsIcon}>
                      <Users />
                    </div>
                    <p className={styles.noResultsText}>هیچ بیماری با این فیلترها یافت نشد</p>
                    <button
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterSchema('all');
                      }}
                      className={styles.clearFiltersButton}
                    >
                      پاک کردن فیلترها
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="forms" className={styles.tabsContent}>
              <AnimatePresence mode="wait">
                {!showSessionNotes ? (
                  <motion.div
                    key="form-selection"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={styles.formsTabStack}
                    dir="rtl"
                  >
                    {/* Info Card */}
                    <div className={styles.infoCard}>
                      <div className={styles.infoCardHeader}>
                        <div className={styles.infoCardIcon}>
                          <FileText />
                        </div>
                        <div className={styles.infoCardContent}>
                          <h3 className={styles.infoCardTitle}>مدیریت لیست مراجعین</h3>
                          <p className={styles.infoCardDescription}>
                            لیست مراجعین خود را مشاهده و مدیریت کنید
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* New Session Note Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      onClick={() => router.push('/dashboard/new-note')}
                      className={styles.sessionNotesCard}
                    >
                      <div className={styles.sessionNotesContent}>
                        <div className={styles.sessionNotesIcon}>
                          <Plus />
                        </div>
                        <div className={styles.sessionNotesText}>
                          <h3 className={styles.sessionNotesTitle}>
                            افزودن یادداشت جدید
                          </h3>
                          <p className={styles.sessionNotesDescription}>
                            ثبت یادداشت برای مراجع جدید یا جلسات جدید مراجعین قبلی
                          </p>
                        </div>
                        <ChevronRight className={styles.sessionNotesArrow} />
                      </div>
                    </motion.div>

                    {/* Session Notes Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => router.push('/dashboard/forms/patients-list')}
                      className={styles.sessionNotesCard}
                    >
                      <div className={styles.sessionNotesContent}>
                        <div className={styles.sessionNotesIcon}>
                          <MessageSquare />
                        </div>
                        <div className={styles.sessionNotesText}>
                          <h3 className={styles.sessionNotesTitle}>
                            لیست مراجعین
                          </h3>
                          <p className={styles.sessionNotesDescription}>
                            یادداشت جلسات و تحلیل هوش مصنوعی هر مراجع دارای پرونده
                          </p>
                          <div className={styles.sessionNotesMeta}>
                            <div className={styles.metaBadge}>
                              <Users />
                              <span className={styles.metaBadgeText}>
                                {establishedPatientsForNotes.length} مراجع با پرونده
                              </span>
                            </div>
                            <div className={styles.metaBadge}>
                              <FileText />
                              <span className={styles.metaBadgeText}>یادداشت‌های کامل</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={styles.sessionNotesArrow} />
                      </div>
                    </motion.div>

                    {/* Statistics */}
                    <div className={styles.statsGridSmall}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={styles.statCardSmall}
                      >
                        <div className={styles.statCardSmallHeader}>
                          <div className={`${styles.statCardSmallIcon} ${styles.statCardSmallIconPrimary}`}>
                            <Users />
                          </div>
                          <div>
                            <p className={styles.statCardSmallLabel}>تعداد مراجعین</p>
                            <p className={styles.statCardSmallValue}>{patients.length}</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={styles.statCardSmall}
                      >
                        <div className={styles.statCardSmallHeader}>
                          <div className={`${styles.statCardSmallIcon} ${styles.statCardSmallIconSafe}`}>
                            <Calendar />
                          </div>
                          <div>
                            <p className={styles.statCardSmallLabel}>جلسات این هفته</p>
                            <p className={styles.statCardSmallValue}>{Math.floor(patients.length * 0.3)}</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={styles.statCardSmall}
                      >
                        <div className={styles.statCardSmallHeader}>
                          <div className={`${styles.statCardSmallIcon} ${styles.statCardSmallIconAttention}`}>
                            <FileText />
                          </div>
                          <div>
                            <p className={styles.statCardSmallLabel}>یادداشت‌های ثبت شده</p>
                            <p className={styles.statCardSmallValue}>{Math.floor(patients.length * 4.5)}</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <SessionNotesView
                    key="session-notes"
                    patients={establishedPatientsForNotes}
                    onBack={() => setShowSessionNotes(false)}
                  />
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="clinic-management" className={styles.tabsContent}>
              <ClinicManagementView
                patients={patientsData}
                onPatientClick={handleClinicCalendarPatientClick}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedPatient?.clinicalEngagement === 'new_intake' && (
          <NewIntakePatientView
            key={selectedPatient.id}
            patient={selectedPatient}
            onClose={() => setSelectedPatientId(null)}
          />
        )}
        {selectedPatient?.clinicalEngagement === 'established' && (
          <PatientDetailView
            key={selectedPatient.id}
            patient={selectedPatient}
            onClose={() => setSelectedPatientId(null)}
          />
        )}
      </AnimatePresence>

      {/* Urgent Patients Panel */}
      <UrgentPatientsPanel
        patients={urgentPatientsData}
        isOpen={showUrgentPanel}
        onClose={() => setShowUrgentPanel(false)}
        onPatientClick={setSelectedPatientId}
      />

      {/* Form Builder Dialog */}
      <FormBuilderDialog
        open={showFormBuilder}
        onClose={() => setShowFormBuilder(false)}
      />

    </div>
  );
}
