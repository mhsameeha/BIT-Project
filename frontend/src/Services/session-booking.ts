import { api, isApiError } from '../lib/api-client';

export interface SessionBookingRequest {
  tutorId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  sessionName: string;
  sessionFee: number;
  currency?: string;
  transactionReference?: string;
  paymentProof: File;
  requestMessage?: string;
}

export interface SessionBookingResponse {
  sessionId: string;
  paymentId: string;
  message: string;
  sessionStatus: string;
  paymentStatus: string;
}

export async function bookSession(request: SessionBookingRequest): Promise<SessionBookingResponse | { error: string }> {
  try {
    const formData = new FormData();
    formData.append('tutorId', request.tutorId);
    formData.append('startTime', request.startTime);
    formData.append('endTime', request.endTime);
    formData.append('sessionName', request.sessionName);
    formData.append('sessionFee', request.sessionFee.toString());
    
    if (request.currency) {
      formData.append('currency', request.currency);
    }
    
    if (request.transactionReference) {
      formData.append('transactionReference', request.transactionReference);
    }
    
    if (request.requestMessage) {
      formData.append('requestMessage', request.requestMessage);
    }
    
    formData.append('paymentProof', request.paymentProof);

    const result = await api.postForm<SessionBookingResponse>('/api/Session/book', formData);
    
    if (isApiError(result)) {
      return { error: result.error };
    }
    
    return result;
  } catch (error) {
    return { error: 'Failed to book session. Please try again.' };
  }
}
