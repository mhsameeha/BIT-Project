import { API_BASE_URL } from '@/config';
import { api, isApiError } from '../lib/api-client';
import type { PaginatedCourse } from "@/types/course";
import type { Session } from "@/types/session";
import { TutorAccountDetails } from '@/types/tutor-account-data';
import { TutorData } from '@/types/tutor-data';

export interface TutorEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface TutorExperience {
  position: string;
  company: string;
  duration: string;
  description: string;
}

export interface TutorDetailData {
  tutorId: string;
  firstName: string;
  lastName: string;
  tutorName: string;
  tutorDescription: string;
  tutorRate: number;
  status: string;
  experience: string | TutorExperience[];
  education: string | TutorEducation[];
  language: string[];
  specialities: string[];
  hasAvailableTimeSlots: boolean;
}

export interface LearnerInfo {
  learnerId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface TutorAvailability {
  day: string;
  timeSlots: string[];
}

export interface TutorDateAvailability {
  date: string; // ISO date string
  dayOfWeek: string;
  timeSlots: string[];
}

export interface TutorAvailabilityResponse {
  tutorId: string;
  availability: TutorAvailability[];
  dateAvailability: TutorDateAvailability[];
}

export async function getAvailableTutors(): Promise<TutorDetailData[] | { error: string }> {
  const result = await api.get<TutorDetailData[]>('/Tutor/available-tutors');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getTutorById(tutorId: string): Promise<TutorDetailData | { error: string }> {
  const result = await api.get<TutorDetailData>(`/Tutor/tutor/${tutorId}`);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getTutorAvailability(tutorId: string): Promise<TutorAvailabilityResponse | { error: string }> {
  const result = await api.get<TutorAvailabilityResponse>(`/Tutor/availability/${tutorId}`);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getLearnerInfo(): Promise<LearnerInfo | { error: string }> {
  const result = await api.get<LearnerInfo>('/Tutor/learner-info');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getCoursesByTutor(page = 1): Promise<PaginatedCourse | { error: string }> {
  const result = await api.get<PaginatedCourse>(`/Tutor/tutorCourses/${page}`);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getTutorDashboardData(): Promise<Record<string, unknown> | { error: string }> {
  // TODO: Replace hardcoded email with actual user email from auth context
  const result = await api.get<Record<string, unknown>>('/Tutor/TutorProfileData/prof.chen@educonnect.com');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getUpcomingSessions(): Promise<Session[] | { error: string }> {
  const result = await api.get<Session[]>('/Tutor/UpcomingSessions');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getTutorData(): Promise<TutorData | { error: string }> {
  const result = await api.get<TutorData>('/Tutor/TutorData');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  console.log("res",result);
  return result;
}

export async function getTutorDataById(tutorId:string): Promise<TutorData | { error: string }> {
  const result = await api.get<TutorData>(`/Tutor/TutorData/${tutorId}`);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  console.log("res",result);
  return result;
}
