import { api } from "@/lib/api-client";

export async function AddAvailability(availabilityData: Record<string, unknown>): Promise<{ data?: Record<string, unknown>; error?: string }> {
  try {
    await api.post('/api/TutorAvailability/AddAvailability', availabilityData);
    return { data: availabilityData };
  } catch (error) {
    return { error: 'Something went wrong while adding availability' };
  }
}
