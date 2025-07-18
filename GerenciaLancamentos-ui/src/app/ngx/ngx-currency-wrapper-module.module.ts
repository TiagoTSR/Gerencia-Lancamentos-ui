// ngx-currency-wrapper.module.ts
import { NgModule } from '@angular/core';
import { NgxCurrencyDirective } from 'ngx-currency';

@NgModule({
  imports: [NgxCurrencyDirective],   // importa a diretiva standalone
  exports: [NgxCurrencyDirective]    // exporta para uso nos templates dos componentes
})
export class NgxCurrencyWrapperModule {}
