import { Component, input, output } from '@angular/core';
import { Checklist, RemoveChecklist } from '../../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-header',
  imports: [RouterLink],
  template: ` 
  <header>
    <a routerLink="/home"><button>Home</button></a>
    <h1>{{checklist().title}}</h1>
    <div>
      <button (click)="addItem.emit()">Add Item</button>
      <button (click)="resetChecklist.emit(checklist().id)">Reset</button>
    </div>
  </header> `,
  styles: ``,
})
export class ChecklistHeaderComponent {
  checklist = input.required<Checklist>();
  addItem = output();
  resetChecklist = output<RemoveChecklist>();
}
