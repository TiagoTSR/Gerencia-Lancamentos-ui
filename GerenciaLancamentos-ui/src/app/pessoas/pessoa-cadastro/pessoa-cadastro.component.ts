import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';


import { PessoaService } from '../pessoa.service';
import { Pessoa } from '../../core/model';
import { Contato } from '../../core/model';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: false,
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.scss']
})
export class PessoaCadastroComponent implements OnInit {
  pessoa: Pessoa = new Pessoa();
  exbindoFormularioContato: boolean = false;
  contato?: Contato;
  contatoIndex?: number;
  estados: any[] = [];
  cidades: any[] = [];
  estadoSelecionado?: number;


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

  carregarCidades() {
    this.pessoaService.pesquisarCidades(this.estadoSelecionado!).then(lista => {
      this.cidades = lista.map(c => ({ label: c.nome, value: c.codigo }));
    })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarEstados() {
    this.pessoaService.listarEstados().then(lista => {
      this.estados = lista.map(uf => ({ label: uf.nome, value: uf.codigo }));
    })
      .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.pessoa.codigo)
  }
  
  
isCidadeComEstado(cidade: any): cidade is { estado: { codigo: number } } {
  return cidade && typeof cidade === 'object' && 'estado' in cidade && cidade.estado && typeof cidade.estado.codigo === 'number';
}

carregarPessoa(codigo: number) {
  this.pessoaService.buscarPorCodigo(codigo)
    .then((pessoa: Pessoa) => {
      this.pessoa = pessoa;
      this.estadoSelecionado = this.isCidadeComEstado(this.pessoa.endereco.cidade)
        ? this.pessoa.endereco.cidade.estado.codigo
        : undefined;

      if (this.estadoSelecionado) {
        this.carregarCidades();
      }
      this.atualizarTituloEdicao();
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
