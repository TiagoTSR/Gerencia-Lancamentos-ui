import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Se a URL de navegação é o callback de autorização (contém code & state)
    // não tentamos renovar o token aqui — o AuthorizedComponent fará o exchange do code.
    const url = state.url || '';
    if (url.includes('/authorized') || (url.includes('code=') && url.includes('state='))) {
      console.log('Navegação para callback de autorização detectada, pulando refresh de token');
      return true;
    }

    if (this.auth.isAccessTokenInvalido()) {
      console.log('Navegação com access token inválido. Obtendo novo token...');

      return this.auth.obterNovoAccessToken()
        .then(() => {
          if (this.auth.isAccessTokenInvalido()) {
            this.auth.login();
            return false;
          }

          return this.podeAcessarRota(next.data['roles']);
        });
    }

    return this.podeAcessarRota(next.data['roles']);
  }

  podeAcessarRota(roles: string[]): boolean {
    if (roles && !this.auth.temQualquerPermissao(roles)) {
      this.router.navigate(['/nao-autorizado']);
      return false;
    }

    return true;
  }
}