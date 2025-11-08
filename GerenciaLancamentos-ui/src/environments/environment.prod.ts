export const environment = {
  production: true,
  apiUrl: 'https://gerencia-api.herokuapp.com',
  authServerUrl: 'https://gerencia-api.herokuapp.com',
  tokenAllowedDomains: [ /gerencia-api.herokuapp.com/ ],
  tokenDisallowedRoutes: [/\/oauth2\/token/],
  oauthCallbackUrl: 'https://oidcdebugger.com/debug'
};