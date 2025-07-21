import { API_BASE_URL } from "@/config";
import { Session } from "@/types/session";



export async function getSessionsByTutor(): Promise <Session[]| {error:string}> {

  try {
    const response = await fetch(`${API_BASE_URL}/api/Session/SessionsByTutor`, {
      method: 'GET',
    // headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return { error: errorMessage || 'Invalid Request' };
    }

    return response.json(); // ✅ Just return the single value
  } catch (error) {
    console.error('Request Error:', error);
    return { error: 'Request Error' };
  }
}

