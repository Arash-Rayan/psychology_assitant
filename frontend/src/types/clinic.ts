export type SlotStatus = "available" | "booked" | "unavailable";

/** اتاق فیزیکی یا واحد رزرو؛ هر اتاق به یک درمانگر وصل می‌شود (نمای تقویم مدیریت کلینیک). */
export interface ClinicRoom {
  id: string;
  /** نام کوتاه برای پنل ادمین، مثلاً «اتاق ۲» یا «ویزیت شمال» */
  name: string;
  /** توضیح یک‌خطی اختیاری برای کاربرد اتاق */
  description?: string;
  doctorId: string;
}

export interface Doctor {
  id: string;
  name: string;
  nameFa: string;
  specialty: string;
  specialtyFa: string;
  yearsExperience: number;
  bio: string;
  bioFa: string;
  imageColor: string;
}

export interface ScheduleSlot {
  id: string;
  doctorId: string;
  date: string;
  start: string;
  end: string;
  status: SlotStatus;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface BookingFormData {
  name: string;
  age: string;
  gender: string;
  mainConcern: string;
}

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export interface BookingFlowState {
  step: BookingStep;
  form: BookingFormData;
  chatMessages: ChatMessage[];
  chatTurn: number;
  chatComplete: boolean;
  suggestedDoctorId: string | null;
  matchReason: string;
  selectedSlotId: string | null;
}
