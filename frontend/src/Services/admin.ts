import { api, isApiError } from '@/lib/api-client';
import { AdminDashboardData } from '@/types/admin-dashboard-data';

export async function getAdminDashboardData(): Promise<AdminDashboardData | { error: string }> {
  const result = await api.get<AdminDashboardData>('/api/Admin/AdminDashboardData', { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }

  return result;
}

export async function approveTutorApplication(tutorId:string): Promise< void | { error: string }> {
  const result = await api.put<void>(`/api/Admin/ApproveTutorApp/${tutorId}`, { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }

  return result;
}

export async function rejectTutorApplication(tutorId:string): Promise< void | { error: string }> {
  const result = await api.put<void>(`/api/Admin/RejectTutorApp/${tutorId}`, { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }
  return result;
}

