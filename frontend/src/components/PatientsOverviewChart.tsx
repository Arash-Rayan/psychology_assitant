import { motion } from 'motion/react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import styles from './PatientsOverviewChart.module.css';

interface PatientChartData {
  id: string;
  name: string;
  score: number;
  anxiety: number;
  status: 'safe' | 'attention' | 'urgent';
}

interface PatientsOverviewChartProps {
  patients: PatientChartData[];
  onPatientClick: (patientId: string) => void;
  averageScore: number;
}

export function PatientsOverviewChart({ patients, onPatientClick, averageScore }: PatientsOverviewChartProps) {
  const statusColors = {
    safe: '#6fcf97',
    attention: '#f2c94c',
    urgent: '#eb5757'
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.tooltip} dir="rtl">
          <p className={styles.tooltipName}>{data.name}</p>
          <p className={styles.tooltipText}>امتیاز کلی: {data.score}</p>
          <p className={styles.tooltipText}>امتیاز پایداری: {data.anxiety}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3>نمای کلی بیماران</h3>
          <p>
            وضعیت همه بیماران بر اساس امتیاز سلامت روان و امتیاز پایداری
          </p>
        </div>
        <div className={styles.averageBadge}>
          <TrendingUp />
          <span className={styles.averageBadgeText}>میانگین: {averageScore}</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="score" 
                name="امتیاز کلی"
                domain={[0, 100]}
                stroke="#6B7280"
                style={{ fontFamily: 'inherit', fontSize: '12px' }}
                label={{ value: 'امتیاز سلامت روان', position: 'insideBottom', offset: -10, style: { fontFamily: 'inherit', fill: '#6B7280' } }}
              />
              <YAxis 
                type="number" 
                dataKey="anxiety" 
                name="پایداری"
                domain={[0, 100]}
                stroke="#6B7280"
                style={{ fontFamily: 'inherit', fontSize: '12px' }}
                label={{ value: 'امتیاز پایداری', angle: -90, position: 'insideLeft', style: { fontFamily: 'inherit', fill: '#6B7280' } }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              
              {/* Average lines */}
              <ReferenceLine 
                x={averageScore} 
                stroke="#8B5CF6" 
                strokeDasharray="5 5" 
                strokeWidth={2}
                label={{ 
                  value: 'میانگین', 
                  position: 'top',
                  style: { fontFamily: 'inherit', fill: '#8B5CF6' }
                }}
              />
              
              <Scatter 
                name="بیماران" 
                data={patients} 
                onClick={(data: any) => {
                  // Recharts Scatter onClick receives the data point directly
                  if (data && data.id) {
                    onPatientClick(data.id);
                  } else if (data && data.payload && data.payload.id) {
                    onPatientClick(data.payload.id);
                  }
                }}
                cursor="pointer"
              >
                {patients.map((patient, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={statusColors[patient.status]}
                    opacity={0.8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotSafe}`}></div>
            <span className={styles.legendText}>بالای میانگین (ایمن)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotAttention}`}></div>
            <span className={styles.legendText}>نزدیک میانگین (توجه)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotUrgent}`}></div>
            <span className={styles.legendText}>زیر میانگین (فوری)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
