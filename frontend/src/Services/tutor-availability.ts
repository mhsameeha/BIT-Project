import { API_BASE_URL } from "@/config";
import { TutorAvailabilitySettings } from "@/types/tutor-availability";

export async function AddAvailability(availabilityData: TutorAvailabilitySettings): Promise<{ data?: any; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/TutorAvailability/AddAvailability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('custom-auth-token')}`
      },
      body: JSON.stringify(availabilityData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('error', errorData);
      return { error: errorData.message || 'Failed to add availability' };
    }
    const result = await response.text();
 console.log('data', result);

    return { data: result };
  } catch (error) {
    console.error('Add availability error:', error);
    return { error: 'Something went wrong while adding availability' };
  }
}
