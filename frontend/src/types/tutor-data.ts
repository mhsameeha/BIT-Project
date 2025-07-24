export interface TutorEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface TutorExperience {
  position: string;
  company: string;
  from: string;
  to: string;
  description: string;
}

export interface TutorAvailability {
  day: string;
  timeSlots: string[];
}

export interface TutorData {
  id: string;
  name: string;
  avatar: string;
  title: string;
  specialties: string[];
  tutorDescription: string;
  education: TutorEducation[];
  experience: TutorExperience[];
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  tutorRate: number;
  currency: string;
  languages: string[];
  availability: TutorAvailability[];
  isAvailable: boolean;
  status: string;
  approvedDate: Date;
}
