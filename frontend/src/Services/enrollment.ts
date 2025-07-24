import { api, isApiError, type ApiErrorResponse } from '@/lib/api-client';
import { EnrollmentStats } from '@/types/tutor-dashboard-data';

export interface PaymentRequest {
  courseId: string;
  amount: number;
  currency?: string;
  transactionReference?: string;
  paymentProof: File;
  tutorFk: string;
}

export interface PaymentResponse {
  paymentId: string;
  enrollmentId: string;
  paymentStatus: string;
  paymentDate: string;
  message: string;
}

export interface EnrollmentData {
  courseName: string;
  enrollmentId: string;
  courseId: string;
  enrollmentStatus: 'Pending Verification' | 'Active' | 'Rejected';
  enrolledDate: string;
  isPaid: boolean;
  paymentStatus?: string;
}

export interface EnrollmentStatus {
  enrollmentId: string;
  courseId: string;
  enrollmentStatus: 'Pending Verification' | 'Active' | 'Rejected';
  enrolledDate: string;
  courseName?: string;
  isPaid: boolean;
  paymentStatus?: string;
}

export async function checkEnrollmentStatus(courseId: string): Promise<EnrollmentStatus | ApiErrorResponse> {
  const result = await api.get<EnrollmentStatus>(`/Enrollment/course-status/${courseId}`);
  
  if (isApiError(result)) {
    return result;
  }
  
  return result;
}

export async function getMyEnrollments(): Promise<EnrollmentData[] | ApiErrorResponse> {
  const result = await api.get<EnrollmentData[]>('/Enrollment/my-enrollments');
  
  if (isApiError(result)) {
    return result;
  }
  
  return result;
}

export async function getEnrollmentStats(): Promise<EnrollmentStats[] | ApiErrorResponse> {
  const result = await api.get<EnrollmentStats[]>('/Enrollment/enrollment-stats');
  
  if (isApiError(result)) {
    return result;
  }
  
  return result;
}

export async function getEnrollmentsByLearner(): Promise<EnrollmentData[] | ApiErrorResponse> {
  // This method now uses the same endpoint as getMyEnrollments since we get learner from claims
  return getMyEnrollments();
}


export async function submitPayment(paymentData: PaymentRequest): Promise<PaymentResponse | ApiErrorResponse> {
  const formData = new FormData();
  formData.append('courseId', paymentData.courseId);
  formData.append('amount', paymentData.amount.toString());
  formData.append('currency', paymentData.currency || 'LKR');
  
  if (paymentData.transactionReference) {
    formData.append('transactionReference', paymentData.transactionReference);
  }
  
  formData.append('paymentProof', paymentData.paymentProof);

  const result = await api.postForm<PaymentResponse>('/Enrollment/payment', formData);
  
  if (isApiError(result)) {
    return result;
  }
  
  return result;
}
