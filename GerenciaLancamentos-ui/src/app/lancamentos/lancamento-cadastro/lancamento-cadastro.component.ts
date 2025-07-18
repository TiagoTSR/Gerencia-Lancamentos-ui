import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { Lancamento } from './../../core/model';

import { LancamentoService } from '../lancamento.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from '../../pessoas/pessoa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.scss'],
  standalone: false,
})
export class LancamentoCadastroComponent implements OnInit {

  lancamento: Lancamento = new Lancamento();
  formulario!: FormGroup;

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
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo lançamento')

    if (codigoLancamento && codigoLancamento !== 'novo') {
      this.carregarLancamento(codigoLancamento)
    }

    this.carregarCategorias()
    this.carregarPessoas()
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: [ 'RECEITA', Validators.required ],
      dataVencimento: [ null, Validators.required ],
      dataPagamento: [],
      descricao: [null, [ this.validarObrigatoriedade, this.validarTamanhoMinimo(5) ]],
      valor: [ null, Validators.required ],
      pessoa: this.formBuilder.group({
        codigo: [ null, Validators.required ],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [ null, Validators.required ],
        nome: []
      }),
      observacao: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }

  get editando() {
    return Boolean(this.formulario.get('codigo')!.value);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        this.formulario.patchValue(lancamento)
      },
      erro => this.errorHandler.handle(erro));
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

  salvar() {
    if (this.editando) {
      this.atualizarLancamento()
    } else {
      this.adicionarLancamento()
    }
  }

  atualizarLancamento() {
    this.lancamentoService.atualizar(this.formulario.value)
      .then((lancamento:Lancamento) => {
          this.formulario.setValue(lancamento)
          this.messageService.add({ severity: 'success', detail: 'Lançamento alterado com sucesso!' });
          this.atualizarTituloEdicao();
        }
      ).catch(erro => this.errorHandler.handle(erro))
  }

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario.value)
      .then((lancamentoAdicionado: Lancamento | undefined) => {
        if (lancamentoAdicionado && lancamentoAdicionado.codigo) {
          this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });
          this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
        } else {
          this.messageService.add({ severity: 'error', detail: 'Erro ao adicionar o lançamento. Código não encontrado!' });
        }
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset(new Lancamento);

    this.router.navigate(['lancamentos/novo']);
  }

  private atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.formulario.get('descricao')!.value}`);
  }
}
