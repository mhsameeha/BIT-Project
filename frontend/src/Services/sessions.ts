import { API_BASE_URL } from '@/config';
import { api, isApiError } from '../lib/api-client';
import type { Session } from "@/types/session";
import { SessionStatus } from '@/types/session-status';

export async function getSessionsByTutor(): Promise<Session[] | { error: string }> {
  const result = await api.get<Session[]>('/api/Session/SessionsByTutor');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

 type UpdateSessionStatusResult = {
  data?: any;
  error?: string;
};

export async function updateSessionStatus(sessionStatus : SessionStatus):  Promise<UpdateSessionStatusResult | undefined> {

  try {
    const response = await fetch(`${API_BASE_URL}/Session/UpdateSessionStatus`, {
      method: 'PUT',
    headers: {
    //     'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
     body: JSON.stringify(sessionStatus),
    });
    
    if (!response.ok) {
      const errorData = await response.json();;
    return { error: errorData.message || 'Failed to save course' };

    }
    return {data : sessionStatus};
  } catch (error) {
    console.error('Request Error:', error);
  }
}


