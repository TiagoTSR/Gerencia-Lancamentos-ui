import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { throwError } from 'rxjs';

export class NotAuthenticatedError { }

@Injectable()
export class GerenciaHttpInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('/oauth/token') && this.auth.isAccessTokenInvalido()) {
      return from(this.auth.obterNovoAccessToken())
        .pipe(
          mergeMap(() => {
            if (this.auth.isAccessTokenInvalido()) {
              throw new NotAuthenticatedError();
            }

          return next.handle(this.adicionarToken(req));
        }),
        catchError((err) => {
          console.log(`[INTERCEPTOR] ❌ Erro ao renovar token:`, err);
          this.isRefreshing = false;
          this.auth.limparAccessToken();
          this.auth.login();
          return throwError(() => err);
        })
      );
  }

  private adicionarToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('token');
    if (token) {
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return req;
  }
}