import { inject, Injectable, InjectionToken, PLATFORM_ID, resource } from '@angular/core';
import { of } from 'rxjs';
import { Checklist } from '../interfaces/checklist';
import { ChecklistItem } from '../interfaces/checklistItem';

export const LOCAL_STORAGE = new InjectionToken<Storage>('window local storage object', {
  providedIn: 'root',
  factory: () => {
    return inject(PLATFORM_ID) === 'browser' ? window.localStorage : ({} as Storage);
  },
});

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  loadChecklist() {
    return resource({
      loader: () =>
        Promise.resolve(this.storage.getItem('checklists')).then((checklist) =>
          checklist ? (JSON.parse(checklist) as Checklist[]) : [],
        ),
    });

    // Using Observables
    // const checklist = this.storage.getItem('checklists');
    // return of(checklist ? (JSON.parse(checklist) as Checklist[]) : []);
  }

  loadChecklistItems() {
    return resource({
      loader: () =>
        Promise.resolve(this.storage.getItem('checklistItems')).then((checklistsItems) =>
          checklistsItems ? (JSON.parse(checklistsItems) as ChecklistItem[]) : [],
        ),
    });
  }

  saveChecklists(checklists: Checklist[]) {
    this.storage.setItem('checklists', JSON.stringify(checklists));
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    this.storage.setItem('checklistItems', JSON.stringify(checklistItems));
  }
}
