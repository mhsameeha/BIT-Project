import { API_BASE_URL } from '../config';

export interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
  responseType?: 'json' | 'text' | 'blob';
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
}

interface ErrorJsonResponse {
  message?: string;
  error?: string;
}

/**
 * Get the authorization token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('custom-auth-token');
}

/**
 * Create headers with optional authorization
 */
function createHeaders(requireAuth = true, contentType?: string): HeadersInit {
  const headers: HeadersInit = {};

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Base API request function with automatic auth header injection
 */
export async function apiRequest<T>(
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<T | ApiErrorResponse> {
  const { requireAuth = true, responseType = 'json', headers: customHeaders, ...fetchOptions } = options;
  
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      ...createHeaders(requireAuth, options.body instanceof FormData ? undefined : 'application/json'),
      ...customHeaders,
    };

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Request failed';
      
      try {
        const errorJson = JSON.parse(errorText) as ErrorJsonResponse;
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch {
        errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
      }

      return { error: errorMessage };
    }

    // Handle empty responses (like 204 No Content)
    const contentType = response.headers.get('content-type');
    if (!contentType || response.status === 204) {
      return {} as T;
    }

    // Handle different response types based on responseType option
    if (responseType === 'blob') {
      return await response.blob() as T;
    }

    if (contentType.includes('application/json')) {
      return await response.json() as T;
    }

    return await response.text() as T;

  } catch (error) {
    return { 
      error: 'Network error occurred. Please check your connection and try again.',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: data instanceof FormData ? data : JSON.stringify(data) 
    }),

  put: <T>(endpoint: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: data instanceof FormData ? data : JSON.stringify(data) 
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: data instanceof FormData ? data : JSON.stringify(data) 
    }),

  delete: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),

  // Special method for multipart/form-data uploads
  postForm: <T>(endpoint: string, formData: FormData, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: formData 
    }),
};

/**
 * Check if response is an error
 */
export function isApiError(response: unknown): response is ApiErrorResponse {
  return Boolean(response && typeof response === 'object' && response !== null && 'error' in response);
}
