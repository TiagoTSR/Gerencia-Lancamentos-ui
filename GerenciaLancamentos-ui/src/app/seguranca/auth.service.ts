import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from 'crypto-js';
import { firstValueFrom } from 'rxjs';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  oauthTokenUrl = environment.apiUrl + '/oauth2/token';
  oauthAuthorizeUrl = environment.apiUrl + '/oauth2/authorize'
  jwtPayload: any ;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService  
  ) { 
    this.carregarToken();
  }

  private readonly CLIENT_ID = 'angular';

  login() {
    const state = this.gerarStringAleatoria(40);
    const codeVerifier = this.gerarStringAleatoria(128);

    localStorage.setItem('state', state);
    localStorage.setItem('codeVerifier', codeVerifier);

    const challengeMethod = 'S256'
    const codeChallenge = CryptoJS.SHA256(codeVerifier)
      .toString(CryptoJS.enc.Base64)
      .replace(/=/g, '')          // ✅ CERTO
      .replace(/\+/g, '-')        // ✅ CERTO (+ vira -)
      .replace(/\//g, '_');       // ✅ CERTO (/ vira _)

    const redirectURI = encodeURIComponent(environment.oauthCallbackUrl);

    const clientId = this.CLIENT_ID;
    const scope = 'read write'
    const responseType = 'code'

    const params = [
      'response_type=' + responseType,
      'client_id=' + clientId,
      'scope=' + scope,
      'code_challenge=' + codeChallenge,
      'code_challenge_method=' + challengeMethod,
      'state=' + state,
      'redirect_uri=' + redirectURI 
    ]

    window.location.href = this.oauthAuthorizeUrl + '?' +  params.join('&');
  }

  logout() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    this.http.post('/oauth2/revoke', { token: refreshToken }).subscribe();
  }
  localStorage.clear();
  window.location.href = '/logout?returnTo=...';
}

  obterNovoAccessTokenComCode(code: string, state: string) : Promise<any>{
    const stateSalvo = localStorage.getItem('state');

    if (stateSalvo !== state) {
      return Promise.reject(null);
    }

    const codeVerifier = localStorage.getItem('codeVerifier')!;

    const payload = new HttpParams()
      .append('grant_type', 'authorization_code')
      .append('code', code)
      .append('redirect_uri', environment.oauthCallbackUrl)
      .append('code_verifier', codeVerifier)
      .append('client_id', this.CLIENT_ID);

   const headers = new HttpHeaders()
     .set('Content-Type', 'application/x-www-form-urlencoded');

    return firstValueFrom(this.http.post<any>(this.oauthTokenUrl, payload, { headers }))
      .then((response:any) => {
        this.armazenarToken(response['access_token']);
        this.armazenarRefreshToken(response['refresh_token']);
        console.log('Novo access token criado!');
        return Promise.resolve(null);
      })
      .catch((response:any) => {
        console.error('Erro ao gerar o token com o code.', response);
        return Promise.resolve();
      });
      
  }

  obterNovoAccessToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    const codeVerifier = localStorage.getItem('codeVerifier');

    if (!refreshToken || !codeVerifier) {
      console.error('Refresh token ou code verifier não encontrado');
      this.login();
      return Promise.reject();
    }

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
      
    const payload = new HttpParams()
      .append('grant_type', 'refresh_token')
      .append('refresh_token', refreshToken)
      .append('client_id', this.CLIENT_ID)
      .append('code_verifier', codeVerifier)
      .append('scope', 'read write');

    return firstValueFrom(this.http.post<any>(this.oauthTokenUrl, payload, { headers, withCredentials: true }))
      .then((response:any) => {
        this.armazenarToken(response['access_token']);
        this.armazenarRefreshToken(response['refresh_token'])
        console.log('Novo access token criado!');

        return Promise.resolve();
      })
      .catch((response:any) => {
        console.error('Erro ao renovar token.', response);
        this.login();
        return Promise.reject();
      });
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');  
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }
  
  temQualquerPermissao(roles: any) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }
  
  public armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    console.log(this.jwtPayload);
    
    localStorage.setItem('token', token);
  }

  public carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  private armazenarRefreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  private gerarStringAleatoria(tamanho: number) {
    let resultado = '';
    //Chars são URL safe
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < tamanho; i++) {
      resultado += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return resultado;
} 

}
