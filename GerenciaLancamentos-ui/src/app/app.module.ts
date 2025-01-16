import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { PessoasModule } from './pessoas/pessoas.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmationService, MessageService } from 'primeng/api';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LancamentosModule } from './lancamentos/lancamentos.module';

// Função para configurar o TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


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
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
