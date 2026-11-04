import { Component, input } from '@angular/core';
import { Checklist } from '../../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-header',
  imports: [RouterLink],
  template: ` 
  <header>
    <a routerLink="/home"></a>
    <h1>{{checklist().title}}</h1>
    </header> `,
  styles: ``,
})
export class ChecklistHeaderComponent {
  checklist = input.required<Checklist>();
}
