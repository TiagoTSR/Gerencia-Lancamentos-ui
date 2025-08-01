import { Component,OnInit } from '@angular/core';
import { RelatoriosService } from '../relatorios.service';

@Component({
  selector: 'app-relatorio-lancamentos',
  standalone: false,
  templateUrl: './relatorio-lancamentos.component.html',
  styleUrls: ['./relatorio-lancamentos.component.scss']
})
export class RelatorioLancamentosComponent implements OnInit {

  periodoInicio?: Date;
  periodoFim?: Date;

  constructor(private relatoriosService: RelatoriosService) { }

  ngOnInit() { }

  gerar() {
    this.relatoriosService.relatorioLancamentosPorPessoa(this.periodoInicio!, this.periodoFim!)
      .then(relatorio => {
        if (relatorio) {
          const url = window.URL.createObjectURL(relatorio);
          window.open(url);
        } else {
          alert('Nenhum relatório foi gerado.');
          }
        });
    }
  }