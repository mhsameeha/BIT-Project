import { API_BASE_URL } from '@/config';
import { api, isApiError } from '../lib/api-client';
import type { Session } from "@/types/session";
import { SessionStatus } from '@/types/session-status';

export async function getSessionsByTutor(): Promise<Session[] | { error: string }> {
  const result = await api.get<Session[]>('/Session/SessionsByTutor');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

 type UpdateSessionStatusResult = {
  data?: any;
  error?: string;
};

export async function updateSessionStatus(sessionStatus: SessionStatus):  Promise<{data?:any; error?: string }> {
    const result = await api.put<unknown>(`/Session/UpdateSessionStatus`, sessionStatus);
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return { data : result};
}


