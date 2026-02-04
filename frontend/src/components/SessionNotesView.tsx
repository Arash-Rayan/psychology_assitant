import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, FileText, Calendar, User, ArrowRight, Plus, Edit, Trash2 } from 'lucide-react';
import { Patient } from './PatientCard';
import { AddSessionNoteDialog } from './AddSessionNoteDialog';
import NewSessionNotePage from './NewSessionNotePage';

interface SessionNote {
  id: string;
  date: string;
  sessionNumber: number;
  duration: string;
  mood: string;
  mainTopics: string[];
  summary: string;
  homework: string;
  nextSessionGoals: string;
}

interface SessionNotesViewProps {
  patients: Patient[];
  onBack: () => void;
}

export function SessionNotesView({ patients, onBack }: SessionNotesViewProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showNewNotePage, setShowNewNotePage] = useState(false);

  // Mock session notes data
  const getSessionNotes = (patientId: string): SessionNote[] => {
    const noteCount = Math.floor(Math.random() * 5) + 3; // 3-7 sessions
    return Array.from({ length: noteCount }, (_, i) => ({
      id: `${patientId}-note-${i}`,
      date: new Date(Date.now() - (noteCount - i - 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fa-IR'),
      sessionNumber: i + 1,
      duration: '۴۵ دقیقه',
      mood: ['آرام', 'مضطرب', 'غمگین', 'امیدوار', 'خوشحال'][Math.floor(Math.random() * 5)],
      mainTopics: [
        'بررسی احساسات هفته گذشته',
        'تمرین‌های ذهن‌آگاهی',
        'چالش‌های محیط کار',
        'روابط خانوادگی',
        'مدیریت استرس'
      ].slice(0, Math.floor(Math.random() * 3) + 2),
      summary: 'مراجع در این جلسه پیشرفت خوبی در مدیریت احساسات خود نشان داد. مشکلات مربوط به محیط کار به تفصیل بررسی شد و راهکارهای عملی ارائه گردید.',
      homework: 'انجام تمرینات تنفسی روزانه، ثبت احساسات در دفترچه یادداشت، تمرین گفتگوی مثبت با خود',
      nextSessionGoals: 'بررسی پیشرفت در تمرینات خانگی، کار روی طرحواره‌های شناختی، تمرکز بر روابط بین‌فردی'
    }));
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const sessionNotes = selectedPatientId ? getSessionNotes(selectedPatientId) : [];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (selectedPatientId) {
                setSelectedPatientId(null);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-primary/5 border border-border hover:border-primary/30 transition-all duration-200"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت</span>
          </button>
          <div>
            <h2 className="text-2xl text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f2c94c] to-[#e0b73c] flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              {selectedPatient ? `یادداشت‌های جلسات - ${selectedPatient.name}` : 'یادداشت‌های جلسات'}
            </h2>
            <p className="text-muted-foreground mt-1 mr-14">
              {selectedPatient 
                ? `${sessionNotes.length} جلسه ثبت شده` 
                : 'انتخاب مراجع برای مشاهده یادداشت‌ها'}
            </p>
          </div>
        </div>
        {selectedPatient && (
          <button 
            onClick={() => setShowNewNotePage(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#f2c94c] to-[#e0b73c] text-white hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>یادداشت جدید</span>
          </button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedPatientId ? (
          // Patients List
          <motion.div
            key="patients-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="جستجوی مراجع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                dir="rtl"
              />
              <User className="w-5 h-5 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient, index) => {
                const noteCount = Math.floor(Math.random() * 5) + 3;
                const lastSession = new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000);
                
                return (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className="group p-5 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-foreground mb-1 group-hover:text-primary transition-colors">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          آخرین جلسه: {lastSession.toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    </div>
                    <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{noteCount} جلسه</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        patient.status === 'safe' 
                          ? 'bg-[#6fcf97]/10 text-[#6fcf97]'
                          : patient.status === 'attention'
                          ? 'bg-[#f2c94c]/10 text-[#f2c94c]'
                          : 'bg-[#eb5757]/10 text-[#eb5757]'
                      }`}>
                        {patient.status === 'safe' ? 'ایمن' : patient.status === 'attention' ? 'نیاز به توجه' : 'فوری'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground">مراجعی یافت نشد</p>
              </div>
            )}
          </motion.div>
        ) : (
          // Session Notes List
          <motion.div
            key="notes-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {sessionNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                dir="rtl"
              >
                {/* Note Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f2c94c]/20 to-[#e0b73c]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg text-[#f2c94c]">#{note.sessionNumber}</span>
                    </div>
                    <div>
                      <h3 className="text-lg text-foreground mb-1">جلسه {note.sessionNumber}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{note.date}</span>
                        </div>
                        <span>•</span>
                        <span>{note.duration}</span>
                        <span>•</span>
                        <span className="text-primary">حال عمومی: {note.mood}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[#eb5757]/10 text-muted-foreground hover:text-[#eb5757] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Topics */}
                <div className="mb-4">
                  <h4 className="text-sm text-muted-foreground mb-2 text-right">موضوعات اصلی:</h4>
                  <div className="flex flex-wrap gap-2">
                    {note.mainTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-primary/5 text-sm text-foreground border border-primary/10"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <h4 className="text-sm text-muted-foreground mb-2 text-right">خلاصه جلسه:</h4>
                  <p className="text-foreground leading-relaxed text-right">{note.summary}</p>
                </div>

                {/* Homework */}
                <div className="mb-4">
                  <h4 className="text-sm text-muted-foreground mb-2 text-right">تکالیف خانگی:</h4>
                  <p className="text-foreground leading-relaxed text-right">{note.homework}</p>
                </div>

                {/* Next Session Goals */}
                <div className="p-4 rounded-xl bg-gradient-to-l from-primary/5 to-transparent border border-primary/10">
                  <h4 className="text-sm text-muted-foreground mb-2 text-right">اهداف جلسه بعد:</h4>
                  <p className="text-foreground leading-relaxed text-right">{note.nextSessionGoals}</p>
                </div>
              </motion.div>
            ))}

            {sessionNotes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground mb-4">هنوز یادداشتی ثبت نشده است</p>
                <button 
                  onClick={() => setShowNewNotePage(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-l from-[#f2c94c] to-[#e0b73c] text-white hover:shadow-lg transition-all duration-300"
                >
                  ایجاد اولین یادداشت
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Session Note Dialog */}
      {selectedPatient && (
        <AddSessionNoteDialog
          open={showAddNote}
          onClose={() => setShowAddNote(false)}
          patientName={selectedPatient.name}
          sessionNumber={sessionNotes.length + 1}
        />
      )}

      {/* New Session Note Page */}
      {showNewNotePage && selectedPatient && (
        <div className="fixed inset-0 z-50">
          <NewSessionNotePage
            patientName={selectedPatient.name}
            onClose={() => setShowNewNotePage(false)}
          />
        </div>
      )}
    </div>
  );
}
