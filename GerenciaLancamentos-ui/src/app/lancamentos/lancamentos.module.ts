import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';

import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { LancamentosGridComponent } from './lancamentos-grid/lancamentos-grid.component';
import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    ButtonModule,
    InputTextModule,
    TableModule,
    TabViewModule,
    TooltipModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule,
    InputNumberModule,
    InputMaskModule,
    SharedModule
  ],
  declarations: [LancamentosPesquisaComponent,
    LancamentoCadastroComponent,
    LancamentosGridComponent
  ],
  exports: [LancamentosPesquisaComponent,
    LancamentoCadastroComponent]
})
export class LancamentosModule { }
