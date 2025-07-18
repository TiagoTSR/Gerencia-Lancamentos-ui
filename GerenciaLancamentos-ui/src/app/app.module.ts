import { HttpClientModule } from '@angular/common/http';
import { PessoasModule } from './pessoas/pessoas.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmationService, MessageService } from 'primeng/api';


import { AppRoutingModule } from './app-routing.module';
import { NgxCurrencyDirective } from "ngx-currency";
import { CoreModule } from './core/core.module';
import { LancamentosModule } from './lancamentos/lancamentos.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LancamentosModule,
    FormsModule,
    ReactiveFormsModule,
    PessoasModule,
    SharedModule,
    CoreModule,
    NgxCurrencyDirective
  ],
  providers: [
  MessageService,
  ConfirmationService,
  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  JwtHelperService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
