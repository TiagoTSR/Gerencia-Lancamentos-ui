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
    const url = req.url;
    
    console.log(`[INTERCEPTOR] Requisição: ${url}`);
    console.log(`[INTERCEPTOR] Token inválido? ${this.auth.isAccessTokenInvalido()}`);
    console.log(`[INTERCEPTOR] Já está renovando? ${this.isRefreshing}`);

    // Não intercepta requisições ao token endpoint e authorize
    if (url.includes('/oauth2/token') || url.includes('/oauth2/authorize') || url.includes('/logout')) {
      console.log(`[INTERCEPTOR] Pulando interceptação para: ${url}`);
      return next.handle(req);
    }

    // Se token está válido, apenas adiciona o header
    if (!this.auth.isAccessTokenInvalido()) {
      console.log(`[INTERCEPTOR] Token válido, adicionando header`);
      return next.handle(this.adicionarToken(req));
    }

    // Se token está inválido E já está tentando renovar
    if (this.isRefreshing) {
      console.log(`[INTERCEPTOR] ⚠️ JÁ ESTÁ RENOVANDO! Redirecionando para login`);
      this.auth.login();
      return throwError(() => new NotAuthenticatedError());
    }

    // Se não tem refresh token, vai direto para login
    if (!localStorage.getItem('refreshToken')) {
      console.log(`[INTERCEPTOR] ❌ Sem refresh token! Redirecionando para login`);
      this.auth.login();
      return throwError(() => new NotAuthenticatedError());
    }

    console.log(`[INTERCEPTOR] Token inválido, tentando renovar...`);
    this.isRefreshing = true;

    return from(this.auth.obterNovoAccessToken())
      .pipe(
        mergeMap((res) => {
          console.log(`[INTERCEPTOR] ✅ Token renovado com sucesso`);
          this.isRefreshing = false;

          // Verifica novamente após renovação
          if (this.auth.isAccessTokenInvalido()) {
            console.log(`[INTERCEPTOR] ❌ Token AINDA inválido após renovação!`);
            this.auth.limparAccessToken();
            this.auth.login();
            return throwError(() => new NotAuthenticatedError());
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