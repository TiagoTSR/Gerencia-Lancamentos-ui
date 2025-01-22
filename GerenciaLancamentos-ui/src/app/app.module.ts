import { HttpClientModule } from '@angular/common/http';
import { PessoasModule } from './pessoas/pessoas.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmationService, MessageService } from 'primeng/api';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { LancamentosModule } from './lancamentos/lancamentos.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    LancamentosModule,
    PessoasModule,
    CoreModule,
    AppRoutingModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    [JwtHelperService,{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS },]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
