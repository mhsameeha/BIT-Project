import { api, isApiError } from '../lib/api-client';

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

export interface ApiErrorResponse {
  error: string;
  message?: string;
}

export interface EnrollmentData {
  courseName: string;
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

  const result = await api.postForm<PaymentResponse>('/api/Enrollment/payment', formData);
  
  if (isApiError(result)) {
    return result;
  }
  
  return result;
}

export async function getEnrollmentsByLearner(learnerId: string): Promise<EnrollmentData[] | ApiErrorResponse> {
  const result = await api.get<EnrollmentData[]>(`/api/Enrollment/${learnerId}`);
  
  if (isApiError(result)) {
    return result;
  }
  
  return result;
}
