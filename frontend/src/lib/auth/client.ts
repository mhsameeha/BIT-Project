'use client';
import axios from 'axios';
import type { User } from '@/types/user';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  password: string;
  role: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

//changes done here
function decodeJWT(token: string): Record<string, any> | null {
  try {
    const payload = token.split('.')[1];
    // atob for base64url (replace -/_)
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    console.error('Invalid JWT:', e);
    return null;
  }
}

class AuthClient {

  getBasicUserInfo(): { email: string; name: string; role: string } | null {
    const token = localStorage.getItem('custom-auth-token');
    const decoded = decodeJWT(token);
    if (!decoded) return null;
    return {
      email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
      name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
      role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '',
    };
  }

  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      const response = await axios.post('https://localhost:7028/api/User/signup', {
        firstName: params.firstName,
        lastName: params.lastName,
        dob: params.dob,
        email: params.email,
        password: params.password,
        role:params.role
      });


    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  } catch (error: any) {
    console.error('SignUp error:', error);
    return { error: error?.response?.data || 'Sign up failed' };
  }
}

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    //Sign In API request
    try {
      const response = await fetch('https://localhost:7028/api/User/Signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
        const {token} = await response.json()
      if (!response.ok || token.toLowerCase().includes("invalid")  ) {

        return { error: token || 'Invalid credentials' };
      }
  


      localStorage.setItem('custom-auth-token', token);
  
      return {};
    }
    catch (error) {
      console.error('Sign-in error:', error);
      return { error: 'Something went wrong while signing in' };
    }
 
  }

  

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
