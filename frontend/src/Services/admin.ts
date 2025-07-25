import { Payment } from '@/app/(main)/payment-management/page';

import { AdminDashboardData } from '@/types/admin-dashboard-data';
import { api, isApiError } from '@/lib/api-client';

export async function getAdminDashboardData(): Promise<AdminDashboardData | { error: string }> {
  const result = await api.get<AdminDashboardData>('/Admin/AdminDashboardData', { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }

  return result;
}

export async function getPaymentApprovals(): Promise<Payment[] | { error: string }> {
  const result = await api.get<Payment[]>('/Admin/PaymentApproval', { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }

  return result;
}

export async function getPaymentStatusApproved(paymentId: string): Promise<void | { error: string }> {
  const result = await api.put<void>(`/Admin/PaymentApproved/${paymentId}`, { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }

  return result;
}

export async function getPaymentStatusRejected(paymentId: string): Promise<void | { error: string }> {
  const result = await api.put<void>(`/Admin/PaymentRejected/${paymentId}`, { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }

  return result;
}

export async function approveTutorApplication(tutorId: string): Promise<void | { error: string }> {
  const result = await api.put<void>(`/Admin/ApproveTutorApp/${tutorId}`, { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }

  return result;
}

export async function rejectTutorApplication(tutorId: string): Promise<void | { error: string }> {
  const result = await api.put<void>(`/Admin/RejectTutorApp/${tutorId}`, { requireAuth: false });

  if (isApiError(result)) {
    return { error: result.error };
  }
  return result;
}
