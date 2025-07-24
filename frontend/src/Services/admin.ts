import { api, isApiError } from '@/lib/api-client';
import { AdminDashboardData } from '@/types/admin-dashboard-data';

export async function getAdminDashboardData(): Promise<AdminDashboardData | { error: string }> {
  const result = await api.get<AdminDashboardData>('/Admin/AdminDashboardData', { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }

  return result;
}

export async function approveTutorApplication(tutorId:string): Promise< void | { error: string }> {
  const result = await api.put<void>(`/Admin/ApproveTutorApp/${tutorId}`, { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }

  return result;
}

export async function rejectTutorApplication(tutorId:string): Promise< void | { error: string }> {
  const result = await api.put<void>(`/Admin/RejectTutorApp/${tutorId}`, { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }
  return result;
}

