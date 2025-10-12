export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
  tokenAllowedDomains: [ /localhost:8080/ ],
  tokenDisallowedRoutes: [/\/oauth2\/token/],
  oauthCallbackUrl: 'https://oidcdebugger.com/debug',
  clientSecret: 'sua-senha-secreta-aqui'
};