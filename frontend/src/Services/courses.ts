import { API_BASE_URL } from '@/config';
import { Category } from '@/types/category';
import { Level } from '@/types/level';
import { PaginatedCourse, TutorCourse } from '@/types/course';
import { Language } from '@/types/language';
import { CourseFormData } from '@/types/course-form-data';
import { Speciality } from '@/types/speciality';




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

export async function getAllLanguages(): Promise<Language[] | { error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Course/Languages`, { method: 'GET' });
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
    const response = await fetch(`${API_BASE_URL}/Course/GetAllCourses/${page}`, { method: 'GET' });
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

export async function getAllSpecialties(): Promise<Speciality[] | { error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Speciality/Speciality`, { method: 'GET' });
    if (!response.ok) {
      const errorMessage = await response.text();
      return { error: errorMessage || 'Invalid Request' };
    }
    return response.json();
  } catch (error) {
    console.error('Request Error:', error);
    return { error: 'Request Error' };
  }}


export async function getCourseById(courseId: string): Promise<TutorCourse | { error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Course/CourseById/${courseId}`, { method: 'GET' });
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
};
export async function updateCourse(courseId:string,formData: CourseFormData| undefined): Promise<UpdateCourseResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Course/UpdateCourse/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      //   'Authorization': Bearer ${localStorage.getItem('custom-auth-token')}
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('error', errorData);
      return { error: errorData.message || 'Failed to save course' };
    }
    const text = await response.text();
    console.log('data', text);

   if (text) {
      const result = JSON.parse(text);
      console.log('Update response:', result);
  
    }
    return { data: formData };
  } catch (error) {
    console.error('Save course error:', error);
    return { error: 'Something went wrong while saving the course' };
  }
}

export async function deleteCourse(courseId:string| undefined): Promise<boolean | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Course/DeleteCourse/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': Bearer ${localStorage.getItem('custom-auth-token')}
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('error', errorData);
      return false;
    }
    return true;
    }
  
   catch (error) {
    console.error('Save course error:', error);
    return false;
  }
}

