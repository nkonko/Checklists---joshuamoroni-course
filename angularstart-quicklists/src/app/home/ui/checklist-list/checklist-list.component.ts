import { Component, input, output, signal } from '@angular/core';
import { Checklist, RemoveChecklist } from '../../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-checklist-list',
  styles: `
    ul {
      padding: 0;
      margin: 0;
    }

    li {
      font-size: 1.5rem;
      display: flex;
      justify-content: space-between;
      background: var(--color-light);
      list-style-type: none;
      margin-bottom: 1rem;
      padding: 1rem;
    }

    button {
      margin-left: 1rem;
    }
  `,
  template: `
    <header>
      <h2>{{ title() }}</h2>
    </header>
    <section>
      <ul>
        @for (checklist of checklistList(); track checklist.id) {
          <li>
            <a routerLink="/checklist/{{ checklist.id }}">
              {{ checklist.title }}
            </a>
            <div>
              <button (click)="edit.emit(checklist)">Edit</button>
              <button (click)="delete.emit(checklist.id)">Delete</button>
            </div>
          </li>
        } @empty {
          <p>Click the add button to create your first checklist!</p>
        }
      </ul>
    </section>
  `,
})
export class ChecklistListComponent {
  title = signal<string>('Checklist list');
  checklistList = input.required<Checklist[]>();
  delete = output<RemoveChecklist>();
  edit = output<Checklist>();
}
