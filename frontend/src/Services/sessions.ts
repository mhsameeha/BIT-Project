import { API_BASE_URL } from '@/config';
import { api, isApiError } from '../lib/api-client';
import type { Session } from "@/types/session";
import type { SessionStatus } from '@/types/session-status';

export interface LearnerSession {
  sessionId: string;
  sessionName: string;
  tutorName: string;
  tutorEmail: string;
  startTime: string;
  endTime: string;
  duration: string;
  sessionStatus: string;
  cost: number;
  currency: string;
  isPaid: boolean;
  sessionLink: string;
  requestMessage?: string;
  rejectionReason?: string;
}

export async function getSessionsByTutor(): Promise<Session[] | { error: string }> {
  const result = await api.get<Session[]>('/Session/SessionsByTutor');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

export async function getUpcomingSessionsByLearner(): Promise<LearnerSession[] | { error: string }> {
  const result = await api.get<LearnerSession[]>('/Session/UpcomingSessionsByLearner');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

 interface UpdateSessionStatusResult {
  data?: SessionStatus;
  error?: string;
}

export async function updateSessionStatus(sessionStatus: SessionStatus):  Promise<{data?:any; error?: string }> {
    const result = await api.put<unknown>(`/Session/UpdateSessionStatus`, sessionStatus);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return { data : result};
}


