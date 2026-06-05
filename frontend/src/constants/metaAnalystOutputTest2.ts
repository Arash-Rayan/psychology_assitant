import { META_ANALYST_TEST_PATIENT_3 } from '@/constants/metaAnalystOutputTest3';

/**
 * خروجی meta_analist برای مراجع تست ۲ — آخرین graph.invoke (user_context.fifth)
 */
export const META_ANALYST_TEST_PATIENT_2 = {
  final_summary:
    'مراجع زنی ۷ سال است که ازدواج کرده و دارای یک فرزند یک ساله است. او از افسردگی و ناراحتی مداوم از زمان ازدواج شکایت دارد که پس از تولد فرزند تشدید شده است. عامل اصلی نارضایتی او دخالت\u200cهای خانواده همسر و عدم توانایی همسر در تعیین حد و مرز با آن\u200cها به ویژه خواهرش است. مراجع احساس می\u200cکند همسرش او را دوست ندارد و فریب خورده است، به\u200cویژه پس از آنکه یک بار در هنگام مشاجره با مشت به کمرش زد. او برای جلب توجه همسر به داد و فریاد و سپس قهر و سکوت روی می\u200cآورد و باور دارد که ناراحتی او تنها راه برای وادار کردن همسر به تلاش است. مراجع در وضعیتی از خشم و بی\u200cتفاوتی گیر افتاده و امید خود را برای تغییر از دست داده است.',
  clinical_sections: [] as const,
} as const;

export interface MetaClinicalSummarySection {
  title: string;
  content: string;
  bullets?: string[];
}

export function getMetaAnalystClinicalSummary(patientId: string | null | undefined): {
  intro: string;
  sections: MetaClinicalSummarySection[];
} | null {
  if (patientId === 'test-patient-2') {
    const data = META_ANALYST_TEST_PATIENT_2;
    return {
      intro: data.final_summary,
      sections: [...data.clinical_sections],
    };
  }

  if (patientId === 'test-patient-3') {
    const data = META_ANALYST_TEST_PATIENT_3;
    return {
      intro: data.final_summary,
      sections: data.clinical_sections as MetaClinicalSummarySection[],
    };
  }

  return null;
}
