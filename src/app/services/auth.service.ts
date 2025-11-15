import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Store userToken in localStorage
   * @param userToken
   */
  setToken(userToken: string) {
    localStorage.setItem('ut', userToken);
  }

  /**
   * Get userToken from localStorage
   * @returns userToken or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem('ut');
  }

  /**
   * Remove userToken from localStorage
   */
  clearToken() {
    localStorage.removeItem('ut');
  }
}
