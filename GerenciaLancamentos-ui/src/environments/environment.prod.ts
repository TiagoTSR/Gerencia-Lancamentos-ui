export const environment = {
  production: false,
  apiUrl: 'https://gerencia-api.herokuapp.com',
  tokenAllowedDomains: [ /gerencia-api.herokuapp.com/ ],
  tokenDisallowedRoutes: [/\/oauth2\/token/],
  oauthCallbackUrl: 'https://oidcdebugger.com/debug'
};