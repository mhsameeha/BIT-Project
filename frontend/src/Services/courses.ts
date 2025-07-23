import { api, isApiError } from '../lib/api-client';
import type { Category } from '@/types/category';
import type { Level } from '@/types/level';
import type { PaginatedCourse, CourseDetailsResponse, TutorCourse } from '@/types/course';
import type { Language } from '@/types/language';
import type { CourseFormData } from '@/types/course-form-data';
import type { Speciality } from '@/types/speciality';
import { API_BASE_URL } from '@/config';

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

export async function getCourseById(courseId: string): Promise<{ error: string } | TutorCourse> {
  const result = await api.get<TutorCourse>(`/api/Course/CourseById/${courseId}`);
  
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

async function addCourse(courseData: CourseFormData): Promise<{ data?: any; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Course/AddCourse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('custom-auth-token')}`
      },
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('error', errorData);
      return { error: errorData.message || 'Failed to add course' };
    }
    const result = await response.json();
 console.log('data', result);

    return { data: result };
  } catch (error) {
    console.error('Add course error:', error);
    return { error: 'Something went wrong while adding the course' };
  }
}


 type UpdateCourseResult = {
  data?: any;
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
