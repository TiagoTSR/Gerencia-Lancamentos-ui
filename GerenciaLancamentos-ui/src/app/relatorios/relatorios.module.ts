import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { RelatorioLancamentosComponent } from './relatorio-lancamentos/relatorio-lancamentos.component';

@NgModule({
  declarations: [RelatorioLancamentosComponent],
  imports: [
    CommonModule,

    SharedModule,
    RelatoriosRoutingModule
  ],

  exports: [
    RelatorioLancamentosComponent // Adicione aqui!
  ]})
export class RelatoriosModule { }