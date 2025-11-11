export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
  authServerUrl: 'http://localhost:8080',
  tokenAllowedDomains: ['localhost:8080'],
  tokenDisallowedRoutes: [/\/oauth2\/token/, /\/logout/],
  oauthCallbackUrl: 'http://local-gerencia.com:8000/authorized',
  logoutRedirectToUrl: 'http://local-gerencia.com:8000'
};