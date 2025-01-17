import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';


import { PessoaService } from '../pessoa.service';
import { Pessoa } from '../../core/model';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.scss']
})
export class PessoaCadastroComponent implements OnInit {
  pessoa: Pessoa = new Pessoa();

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit() {
    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova pessoa');

    if (codigoPessoa && codigoPessoa !== 'nova') {
      this.carregarPessoa(+codigoPessoa); // Converte para número, se necessário.
    }
  }

  get editando(): boolean {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number) {
    this.pessoaService
      .buscarPorCodigo(codigo)
      .then((pessoa: Pessoa | undefined) => {
        if (pessoa) {
          this.pessoa = pessoa;
          this.atualizarTituloEdicao();
        } else {
          this.messageService.add({ severity: 'warn', detail: 'Pessoa não encontrada.' });
        }
      })
      .catch((erro: any) => this.errorHandler.handle(erro));
  }

  salvar(form: NgForm) {
    if (this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: NgForm) {
    this.pessoaService
      .adicionar(this.pessoa)
      .then((pessoaAdicionada: Pessoa | undefined) => {
        if (pessoaAdicionada) {
          this.messageService.add({ severity: 'success', detail: 'Pessoa adicionada com sucesso!' });
          this.router.navigate(['pessoas', pessoaAdicionada.codigo]);
        }
      })
      .catch((erro: any) => this.errorHandler.handle(erro));
  }

  atualizarPessoa(form: NgForm) {
    this.pessoaService
      .atualizar(this.pessoa)
      .then((pessoaAtualizada: Pessoa | undefined) => {
        if (pessoaAtualizada) {
          this.pessoa = pessoaAtualizada;
          this.messageService.add({ severity: 'success', detail: 'Pessoa alterada com sucesso!' });
          this.atualizarTituloEdicao();
        }
      })
      .catch((erro: any) => this.errorHandler.handle(erro));
  }

  nova(form: NgForm) {
    form.reset();

    setTimeout(() => {
      this.pessoa = new Pessoa();
    }, 1);

    this.router.navigate(['pessoas', 'nova']);
  }

  atualizarTituloEdicao() {
    const titulo = this.pessoa.nome ? `Edição de pessoa: ${this.pessoa.nome}` : 'Edição de pessoa';
    this.title.setTitle(titulo);
  }

}
