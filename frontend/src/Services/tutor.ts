import { api, isApiError } from '../lib/api-client';
import type { PaginatedCourse } from "@/types/course";
import type { Session } from "@/types/session";

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

// export async function getTutorCourses(page = 1): Promise<PaginatedCourse | { error: string }> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/Course/Courses/${page}`, { method: 'GET' });
//     if (!response.ok) {
//       const errorMessage = await response.text();
//       return { error: errorMessage || 'Invalid Request' };
//     }
//     return response.json();
//   } catch (error) {
//     console.error('Request Error:', error);
//     return { error: 'Request Error' };
//   }
// }
