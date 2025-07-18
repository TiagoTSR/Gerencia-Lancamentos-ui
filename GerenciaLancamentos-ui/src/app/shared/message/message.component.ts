import { Component, Input } from '@angular/core';
import { AbstractControl, NgModel } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-message',
  template: `
    <div *ngIf="temErro()" class="p-message p-message-error">
      {{ text }}
    </div>
  `,
  styles: [`
    .p-message-error {
      margin: 0;
      margin-top: 4px;
      padding: 3px;
    }
  `]
})
export class MessageComponent {

  @Input() error: string = '';
  @Input() control: AbstractControl | NgModel | null = null;
  @Input() text: string = '';

  temErro(): boolean {
    if (!this.control) {
      return false;
    }

    // AbstractControl (Reactive Forms)
    if ('hasError' in this.control && typeof this.control.hasError === 'function' &&
        'dirty' in this.control && typeof this.control.dirty === 'boolean') {
      return this.control.hasError(this.error) && this.control.dirty;
    }

    // NgModel (Template Driven)
    if ('errors' in this.control && this.control.errors &&
        'dirty' in this.control && typeof this.control.dirty === 'boolean') {
      return !!this.control.errors[this.error] && this.control.dirty;
    }

    return false;
  }
}
