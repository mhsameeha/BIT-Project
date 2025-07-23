import { api, isApiError } from '../lib/api-client';
import type { Category } from '@/types/category';
import type { Level } from '@/types/level';
import type { PaginatedCourse, CourseDetailsResponse } from '@/types/course';
import type { Language } from '@/types/language';
import type { CourseFormData } from '@/types/course-form-data';
import type { Speciality } from '@/types/speciality';

export async function getAllCategories(): Promise<Category[] | { error: string }> {
  const result = await api.get<Category[]>('/api/Course/Categories', { requireAuth: false });
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getAllLanguages(): Promise<Language[] | { error: string }> {
  const result = await api.get<Language[]>('/api/Course/Languages', { requireAuth: false });
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getAllLevels(): Promise<Level[] | { error: string }> {
  const result = await api.get<Level[]>('/api/Course/Difficulties', { requireAuth: false });
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getAllCourses(page = 1): Promise<PaginatedCourse | { error: string }> {
  const result = await api.get<PaginatedCourse>(`/api/Course/GetAllCourses/${page}`, { requireAuth: false });
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getAllSpecialties(): Promise<Speciality[] | { error: string }> {
  const result = await api.get<Speciality[]>('/api/Speciality/Speciality', { requireAuth: false });
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getCourseById(courseId: string): Promise<{ error: string } | Record<string, unknown>> {
  const result = await api.get<Record<string, unknown>>(`/api/Course/CourseById/${courseId}`);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getCourseDetails(courseId: string): Promise<CourseDetailsResponse | { error: string }> {
  const result = await api.get<CourseDetailsResponse>(`/api/Course/CourseDetails/${courseId}`);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

interface UpdateCourseResult {
  data?: unknown;
  error?: string;
}

export async function updateCourse(courseId: string, formData: CourseFormData | undefined): Promise<UpdateCourseResult> {
  if (!formData) {
    return { error: 'No course data provided' };
  }

  const result = await api.put<unknown>(`/api/Course/UpdateCourse/${courseId}`, formData);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return { data: result };
}

export async function deleteCourse(courseId: string | undefined): Promise<boolean | undefined> {
  if (!courseId) {
    return undefined;
  }

  const result = await api.delete<unknown>(`/api/Course/DeleteCourse/${courseId}`);
  
  if (isApiError(result)) {
    return false;
  }
  
  return true;
}
