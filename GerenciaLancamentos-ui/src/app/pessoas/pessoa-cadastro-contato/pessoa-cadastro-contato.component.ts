import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contato } from '../../core/model';

@Component({
  selector: 'app-pessoa-cadastro-contato',
  standalone: false,
  templateUrl: './pessoa-cadastro-contato.component.html',
  styleUrl: './pessoa-cadastro-contato.component.scss'
})

export class PessoaCadastroContatoComponent implements OnInit {

  @Input() contatos: Array<Contato> = []
  exbindoFormularioContato = false;
  contato?: Contato;
  contatoIndex?: number;

  constructor() { }

  ngOnInit(): void {
  }

  prepararNovoContato() {
    this.exbindoFormularioContato = true;
    this.contato = new Contato();
    this.contatoIndex = this.contatos.length;
  }

  prepararEdicaoContato(contato: Contato, index: number) {
    this.contato = this.clonarContato(contato);
    this.exbindoFormularioContato = true;
    this.contatoIndex = index;
  }

  confirmarContato(frm: NgForm) {
    this.contatos[this.contatoIndex!] = this.clonarContato(this.contato!);

    this.exbindoFormularioContato = false;

    frm.reset();
  }

  removerContato(index: number) {
    this.contatos.splice(index, 1);
  }

  clonarContato(contato: Contato): Contato {
    return new Contato(contato.id, contato.nome, contato.email, contato.telefone);
  }

  get editando() {
    return this.contato && this.contato?.id;
  }

}