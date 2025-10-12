import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa, Estado,Cidade } from '../core/model';
import { environment } from '../../environments/environment.prod';

export class PessoaFiltro {
  nome?: string;
  pagina: number = 0;
  itensPorPagina: number = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  pessoasUrl: string
  cidadesUrl: string;
  estadosUrl: string;

  constructor(private http: HttpClient) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
    this.estadosUrl = `${environment.apiUrl}/estados`;
    this.cidadesUrl = `${environment.apiUrl}/cidades`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.pessoasUrl}`, { params })
      .toPromise()
      .then((response: any) => {
        const pessoas = response['content'];

        const resultado = {
          pessoas,
          total: response['totalElements']
        };

        return resultado;
      });
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.pessoasUrl)
      .toPromise()
      .then((response: any) => response['content']);
  }

  excluir(id: number): Promise<void> {
    return this.http.delete<void>(`${this.pessoasUrl}/${id}`).toPromise();
  }

  mudarStatus(id: number, ativo: boolean): Promise<void> {
    return this.http.put<void>(`${this.pessoasUrl}/${id}/ativo`, ativo)
      .toPromise();
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.post<Pessoa>(this.pessoasUrl, pessoa)
      .toPromise()
      .then((response: Pessoa | undefined) => {
        if (!response) {
          throw new Error('Pessoa não foi criada corretamente.');
        }
        return response;
      });
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.id}`, pessoa)
      .toPromise()
      .then((response: Pessoa | undefined) => {
        if (!response) {
          throw new Error('Pessoa não foi atualizada corretamente.');
        }
        return response;
      });
  }

  buscarPorCodigo(id: number): Promise<Pessoa> {
    return this.http.get<Pessoa>(`${this.pessoasUrl}/${id}`).toPromise()
      .then((response: Pessoa | undefined) => {
        if (!response) {
          throw new Error('Pessoa não encontrada.');
        }
        return response;
      });
  }

  listarEstados(): Promise<Estado[]> {
    return this.http.get<Estado[]>(this.estadosUrl).toPromise()
      .then((response: Estado[] | undefined) => {
        if (!response) {
          return [];
        }
        return response;
      });
  }

  pesquisarCidades(estadoId: number): Promise<Cidade[]> {
    const params = new HttpParams()
      .set('estado', estadoId);

    return this.http.get<Cidade[]>(this.cidadesUrl, { params }).toPromise()
      .then((response: Cidade[] | undefined) => {
        if (!response) {
          return [];
        }
        return response;
      });
  }
}