import { Component } from '@angular/core';

import { TableLazyLoadEvent } from 'primeng/table';

import { PessoaFiltro, PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent {
  totalRegistros = 0;
  filtro = new PessoaFiltro()
  pessoas: any[] = [];

  constructor(private PessoaService: PessoaService) { }

  pesquisar(pagina: number = 0): void {
    this.filtro.pagina = pagina;

    this.PessoaService.pesquisar(this.filtro)
      .then((dados: any) => {
        this.pessoas = dados.pessoas;
        this.totalRegistros = dados.total;
      });
  }

  aoMudarPagina(event: TableLazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;
    this.pesquisar(pagina);
  }
}
