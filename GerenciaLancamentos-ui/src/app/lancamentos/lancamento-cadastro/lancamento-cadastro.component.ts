import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';



import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from '../../pessoas/pessoa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Lancamento } from '../../core/model';
import { LancamentoService } from '../lancamento.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  lancamento: Lancamento = new Lancamento();

  categorias: any[] = [];
  pessoas: any[] = []

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.carregarCategorias()
    this.carregarPessoas()
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias
          .map((c: any) => ({ label: c.nome, value: c.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas
          .map((p: any) => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: NgForm) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(() => {
        this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

        form.reset();
        this.lancamento = new Lancamento();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
