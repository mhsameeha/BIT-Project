import { api, isApiError } from "@/lib/api-client";
import type { TutorAvailabilitySettings } from "@/types/tutor-availability";

export async function AddAvailability(availabilityData: Record<string, unknown>): Promise<{ data?: Record<string, unknown>; error?: string }> {
  try {
    await api.post('/TutorAvailability/AddAvailability', availabilityData);
    return { data: availabilityData };
  } catch (error) {
    return { error: 'Something went wrong while adding availability' };
  }
}

export async function GetTutorAvailability(): Promise<TutorAvailabilitySettings | { error: string }> {
  try {
    const result = await api.get<TutorAvailabilitySettings>('/TutorAvailability/GetAvailability');
    
    if (isApiError(result)) {
      return { error: result.error };
    }
    
    return result;
  } catch (error) {
    return { error: 'Failed to fetch tutor availability settings' };
  }
}
