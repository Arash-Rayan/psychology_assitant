export type UserRole =
  | "doctor"
  | "secretary"
  | "patient_new"
  | "patient_existing";

export type DoctorSignupPayload = {
  role: "doctor";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  expertise: string;
  medicalLicenseNumber: string;
};

export type SecretarySignupPayload = {
  role: "secretary";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  doctorReferralCode: string;
};

export type NewPatientSignupPayload = {
  role: "patient_new";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

export type ExistingPatientSignupPayload = {
  role: "patient_existing";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  doctorReferralCode: string;
};

export type SignupPayload =
  | DoctorSignupPayload
  | SecretarySignupPayload
  | NewPatientSignupPayload
  | ExistingPatientSignupPayload;
