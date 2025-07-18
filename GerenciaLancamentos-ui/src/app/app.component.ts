import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  title = 'GerenciaLancamentos-ui';

  constructor(
    private config: PrimeNG,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.translateService.setDefaultLang('pt');
    this.translateService.get('primeng')
      .subscribe(res => this.config.setTranslation(res));
  }

  exibindoNavbar() {
    return this.router.url !== '/login';
  }

}
