import { api, isApiError } from '../lib/api-client';
import type { Session } from "@/types/session";

export async function getSessionsByTutor(): Promise<Session[] | { error: string }> {
  const result = await api.get<Session[]>('/api/Session/SessionsByTutor');
  
  if (isApiError(result)) {
    return { error: result.error };
  }
  
  return result;
}

