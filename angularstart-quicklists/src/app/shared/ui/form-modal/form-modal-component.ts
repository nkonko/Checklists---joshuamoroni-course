import { KeyValuePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule, KeyValuePipe],
  selector: 'app-form-modal-component',
  styles: ``,
  template: ` 
    <header>
      <h2>{{ title() }}</h2>
      <button (click)="close.emit()"> close </button>
    </header>
    <section>
      <form (ngSubmit)="save.emit(); close.emit()" [formGroup]="formGroup()">
      @for (control of formGroup().controls | keyvalue; track control.key) {
        <div>
          <label for="control.key"> {{control.key}}</label>
          <input [id]="control.key"
          type="text"
          [formControlName]="control.key" />
        </div>
      }
      <button type="submit">Save</button>
      </form>
    </section>
  `,
})
export class FormModalComponent {
  title = input.required<string>();
  formGroup = input.required<FormGroup>();
  save = output();
  close = output();
}
