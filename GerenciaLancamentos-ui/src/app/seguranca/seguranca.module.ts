import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { environment } from './../../environments/environment';
import { AuthGuard } from './auth.guard';
import { AuthorizedComponent } from './authorized/authorized.component';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { GerenciaHttpInterceptor } from './gerencia-http-interceptor';

export function tokenGetter(): string {
  return localStorage.getItem('token')!;
}
@NgModule({
  declarations: [AuthorizedComponent],
  imports: [
    CommonModule,
    FormsModule,

    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.tokenAllowedDomains,
        disallowedRoutes: environment.tokenDisallowedRoutes
      }
    }),

    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule,
  ],
  providers: [
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GerenciaHttpInterceptor,
      multi: true
    },
    AuthGuard
  ]
})
export class SegurancaModule { }