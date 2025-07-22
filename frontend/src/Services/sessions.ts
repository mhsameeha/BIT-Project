import { API_BASE_URL } from "@/config";
import { Session } from "@/types/session";
import { SessionStatus } from "@/types/session-status";



export async function getSessionsByTutor(): Promise <Session[]| {error:string}> {

  try {
    const response = await fetch(`${API_BASE_URL}/Session/SessionsByTutor`, {
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


