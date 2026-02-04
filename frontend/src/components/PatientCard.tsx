import { motion } from 'motion/react';
import { User, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './PatientCard.module.css';

export interface Patient {
  id: string;
  name: string;
  status: 'safe' | 'attention' | 'urgent';
  lastActivity: string;
  moodTrend: 'up' | 'down' | 'stable';
  sessionsCount: number;
  lastMood: number; // 0-100
}

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  const statusConfig = {
    safe: {
      avatarClass: styles.avatarSafe,
      badgeClass: styles.statusBadgeSafe,
      barClass: styles.moodBarFillSafe,
      icon: CheckCircle,
      text: 'ایمن'
    },
    attention: {
      avatarClass: styles.avatarAttention,
      badgeClass: styles.statusBadgeAttention,
      barClass: styles.moodBarFillAttention,
      icon: AlertCircle,
      text: 'نیاز به توجه'
    },
    urgent: {
      avatarClass: styles.avatarUrgent,
      badgeClass: styles.statusBadgeUrgent,
      barClass: styles.moodBarFillUrgent,
      icon: AlertCircle,
      text: 'فوری'
    }
  };

  const config = statusConfig[patient.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={styles.card}
      dir="rtl"
    >
      <div className={styles.cardContent}>
        <div className={`${styles.avatar} ${config.avatarClass}`}>
          <User />
        </div>
        
        <div className={styles.patientInfo}>
          <div className={styles.patientHeader}>
            <h3 className={styles.patientName}>{patient.name}</h3>
            <span className={`${styles.statusBadge} ${config.badgeClass}`}>
              {config.text}
            </span>
          </div>
          
          <div className={styles.patientMeta}>
            <div className={styles.metaItem}>
              <span>{patient.sessionsCount} جلسه</span>
            </div>
            <div className={styles.metaItem}>
              {patient.moodTrend === 'up' ? (
                <>
                  <TrendingUp className={styles.trendUp} />
                  <span>روند صعودی</span>
                </>
              ) : patient.moodTrend === 'down' ? (
                <>
                  <TrendingDown className={styles.trendDown} />
                  <span>روند نزولی</span>
                </>
              ) : (
                <>
                  <span className={styles.trendStable}></span>
                  <span>روند ثابت</span>
                </>
              )}
            </div>
          </div>
          
          <div className={styles.moodSection}>
            <div className={styles.moodHeader}>
              <span>وضعیت روحی</span>
              <span>{patient.lastMood}%</span>
            </div>
            <div className={styles.moodBar}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${patient.lastMood}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`${styles.moodBarFill} ${config.barClass}`}
              />
            </div>
          </div>
          
          <p className={styles.lastActivity}>
            آخرین فعالیت: {patient.lastActivity}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
