import { API_BASE_URL } from '@/config';
import { Category } from '@/types/category';
import { Level } from '@/types/level';
import { PaginatedCourse } from '@/types/course';

export async function getAllCategories(): Promise<Category[] | { error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Course/Categories`, { method: 'GET' });
    if (!response.ok) {
      const errorMessage = await response.text();
      return { error: errorMessage || 'Invalid Request' };
    }
    return response.json();
  } catch (error) {
    console.error('Request Error:', error);
    return { error: 'Request Error' };
  }
}

export async function getAllLevels(): Promise<Level[] | { error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Course/Difficulties`, { method: 'GET' });
    if (!response.ok) {
      const errorMessage = await response.text();
      return { error: errorMessage || 'Invalid Request' };
    }
    return response.json();
  } catch (error) {
    console.error('Request Error:', error);
    return { error: 'Request Error' };
  }
}

export async function getAllCourses(page = 1): Promise<PaginatedCourse | { error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Course/Courses?page${page}`, { method: 'GET' });
    if (!response.ok) {
      const errorMessage = await response.text();
      return { error: errorMessage || 'Invalid Request' };
    }
    return response.json();
  } catch (error) {
    console.error('Request Error:', error);
    return { error: 'Request Error' };
  }
}
