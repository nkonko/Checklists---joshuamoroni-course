import { Component, input, signal } from '@angular/core';
import { Checklist } from '../../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-checklist-list',
  styles: ``,
  template: ` 
      <header>
        <h2>{{ title()}}</h2>
      </header> 
      <section>
        <ul>

          @for(checklist of checklistList(); track checklist.id) {
            <li>  
              <a routerLink="/checklist/{{ checklist.id }}">
              {{ checklist.title }}
              </a>
            </li>
          } @empty {
            <p>Click the add button to create your first checklist!</p>
            }
        </ul>
      </section>
    `,
})
export class ChecklistListComponent {
  title = signal<string>('Checklist list')
  checklistList = input.required<Checklist[]>();
}
