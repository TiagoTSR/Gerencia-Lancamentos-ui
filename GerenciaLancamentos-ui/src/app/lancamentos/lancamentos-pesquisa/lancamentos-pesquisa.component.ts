import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';

import { AuthService } from './../../seguranca/auth.service';
import { LancamentoFiltro, LancamentoService } from './../lancamento.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.scss']
})
export class LancamentosPesquisaComponent implements OnInit {

  filtro = new LancamentoFiltro();

  totalRegistros: number = 0

  lancamentos: any[] = [];
  @ViewChild('tabela') grid!: Table;

  constructor(
    private auth: AuthService,
    private lancamentoService: LancamentoService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de lançamentos')
  }

  pesquisar(pagina: number = 0): void {
    this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro)
      .then((resultado: any) => {
        this.lancamentos = resultado.lancamentos;
        this.totalRegistros = resultado.total;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: TableLazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {

    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.reset();
        }

        this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' })
      })
  }

  naoTemPermissao(permissao: string) {
    return !this.auth.temPermissao(permissao);
  }
}
