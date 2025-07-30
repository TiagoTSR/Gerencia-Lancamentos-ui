import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-relatorio-lancamentos',
  standalone: false,
  templateUrl: './relatorio-lancamentos.component.html',
  styleUrls: ['./relatorio-lancamentos.component.scss']
})
export class RelatorioLancamentosComponent implements OnInit {

  periodoInicio?: Date;
  periodoFim?: Date;

  constructor() { }

  ngOnInit() {
  }

  gerar() {
    console.log(this.periodoInicio);
    console.log(this.periodoFim);
  }
}