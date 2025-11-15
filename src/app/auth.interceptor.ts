import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

function getToken(): string | null {
  const authService = inject(AuthService);
  return authService.getToken();
}

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getToken();

  // Only attach header if token exists
  const clonedRequest = token
    ? req.clone({
        setHeaders: {
          'x-api-key': token,
          'cache-control': 'no-cache',
          'pragma': 'no-cache',
          'expires': '0',
        },
      })
    : req;

  return next(clonedRequest);
};
