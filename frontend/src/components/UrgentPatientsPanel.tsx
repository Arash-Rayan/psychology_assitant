import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Phone, Mail, Clock, X } from 'lucide-react';

interface UrgentPatient {
  id: string;
  name: string;
  score: number;
  reason: string;
  lastContact: string;
  phone: string;
  priority: 'high' | 'critical';
}

interface UrgentPatientsPanelProps {
  patients: UrgentPatient[];
  isOpen: boolean;
  onClose: () => void;
  onPatientClick: (patientId: string) => void;
}

export function UrgentPatientsPanel({ patients, isOpen, onClose, onPatientClick }: UrgentPatientsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-gradient-to-l from-[#eb5757]/10 to-[#eb5757]/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#eb5757] to-[#d84747] flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-foreground">بیماران فوری</h2>
                    <p className="text-sm text-muted-foreground">{patients.length} بیمار نیازمند توجه فوری</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Patients List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {patients.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#6fcf97]/10 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-[#6fcf97]" />
                  </div>
                  <p className="text-muted-foreground">هیچ بیمار فوری‌ای وجود ندارد</p>
                </div>
              ) : (
                patients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-[#eb5757]/20 rounded-2xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      onPatientClick(patient.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg text-foreground mb-1">{patient.name}</h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              patient.priority === 'critical'
                                ? 'bg-[#eb5757] text-white'
                                : 'bg-[#eb5757]/10 text-[#eb5757]'
                            }`}
                          >
                            {patient.priority === 'critical' ? 'بحرانی' : 'فوری'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            امتیاز: {patient.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#eb5757]/5 rounded-xl p-3 mb-4">
                      <p className="text-sm text-foreground leading-relaxed">{patient.reason}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>آخرین تماس: {patient.lastContact}</span>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${patient.phone}`;
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span>تماس</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle email
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span>ایمیل</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
