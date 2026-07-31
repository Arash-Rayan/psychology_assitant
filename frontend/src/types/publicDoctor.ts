/** Public marketing profile for a doctor on the platform (SEO / advertising pages). */

export interface DoctorBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Full body for the article page (plain paragraphs). */
  body: string[];
  publishedAt: string;
  readingMinutes: number;
}

export interface DoctorReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DoctorSocialLinks {
  instagram?: string;
  linkedin?: string;
  telegram?: string;
  website?: string;
  youtube?: string;
}

export interface PublicDoctor {
  /** URL segment: /doctors/[slug] */
  slug: string;
  /** Optional link to clinic booking doctor id */
  bookingDoctorId?: string;
  nameFa: string;
  nameEn?: string;
  title: string;
  specialtyFa: string;
  specialties: string[];
  yearsExperience: number;
  shortBio: string;
  fullBio: string;
  accent: string;
  imageSrc?: string;
  /** Clinic / office gallery paths under /public (placeholders OK) */
  clinicImages: string[];
  /** YouTube (or similar) watch / embed URL */
  videoUrl?: string;
  social: DoctorSocialLinks;
  ratingAverage: number;
  ratingCount: number;
  reviews: DoctorReview[];
  blogs: DoctorBlogPost[];
  languages: string[];
  education: string[];
  approaches: string[];
  city: string;
  clinicName: string;
  seoTitle: string;
  seoDescription: string;
}
