import { API_BASE_URL } from '@/config';
import { api, isApiError } from '../lib/api-client';
import type { PaginatedCourse } from "@/types/course";
import type { Session } from "@/types/session";
import { TutorAccountDetails } from '@/types/tutor-account-data';
import { TutorData } from '@/types/tutor-data';

export async function getCoursesByTutor(page = 1): Promise<PaginatedCourse | { error: string }> {
  const result = await api.get<PaginatedCourse>(`/api/Tutor/tutorCourses/${page}`);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getTutorDashboardData(): Promise<Record<string, unknown> | { error: string }> {
  // TODO: Replace hardcoded email with actual user email from auth context
  const result = await api.get<Record<string, unknown>>('/api/Tutor/TutorProfileData/prof.chen@educonnect.com');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getUpcomingSessions(): Promise<Session[] | { error: string }> {
  const result = await api.get<Session[]>('/api/Tutor/UpcomingSessions');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getTutorData(): Promise<TutorData | { error: string }> {
  const result = await api.get<TutorData>('/api/Tutor/TutorData');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  console.log("res",result);
  return result;
}

export async function getTutorDataById(tutorId:string): Promise<TutorData | { error: string }> {
  const result = await api.get<TutorData>(`/api/Tutor/TutorData/${tutorId}`);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  console.log("res",result);
  return result;
}
