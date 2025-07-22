import { PaginatedCourse, TutorCourse } from '@/types/course';
import { Session } from '@/types/session';
import { TutorProfileData } from '@/types/tutor-profile-data';
import { API_BASE_URL } from '@/config';
import { TutorAccountDetails } from '@/types/tutor-account-data';

const token = localStorage.getItem('custom-auth-token');

export async function getCoursesByTutor(page = 1): Promise<PaginatedCourse | { error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Tutor/tutorCourses/${page}`, {
      method: 'GET',
      //      headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
    });
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

export async function getTutorDashboardData(): Promise<TutorProfileData | { error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Tutor/TutorProfileData/${'prof.chen@educonnect.com'}`, {
      method: 'GET',
      // headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return { error: errorMessage || 'Invalid Request' };
    }

    return response.json(); // ✅ Just return the single value
  } catch (error) {
    console.error('Request Error:', error);
    return { error: 'Request Error' };
  }
}

export async function getUpcomingSessions(): Promise<Session[] | { error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Tutor/UpcomingSessions`, {
      method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return { error: errorMessage || 'Invalid Request' };
    }

    return response.json(); // ✅ Just return the single value
  } catch (error) {
    console.error('Request Error:', error);
    return { error: 'Request Error' };
  }
}

export async function getTutorAccountDetails(): Promise<TutorAccountDetails | { error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Tutor/TutorAccountDetails`, { method: 'GET' });
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
