export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  authServerUrl: 'http://localhost:8080',
  tokenAllowedDomains: ['localhost:8080'],
  tokenDisallowedRoutes: [/\/oauth2\/token/, /\/logout/],
  oauthCallbackUrl: 'http://localhost-gerencia.com:8000/authorized',
  logoutRedirectToUrl: 'http://localhost-gerencia.com:8000'
};