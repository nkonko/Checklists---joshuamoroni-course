import { effect, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { AddChecklist, Checklist, EditChecklist } from '../interfaces/checklist';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';
import { ChecklistItemService } from './checklist-item.service';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  checklistItemService = inject(ChecklistItemService);
  storageService = inject(StorageService);

  remove$ = this.checklistItemService.checklistRemoved$;

  loadedChecklists = this.storageService.loadChecklist();

  add$ = new Subject<AddChecklist>();
  edit$ = new Subject<EditChecklist>();

  checklists = linkedSignal({
    source: this.loadedChecklists.value,
    computation: (checklists) => checklists ?? [],
  });

  constructor() {
    this.add$
      .pipe(takeUntilDestroyed())
      .subscribe((checklist) =>
        this.checklists.update((checklists) => [...checklists, this.addIdToCheckList(checklist)]),
      );

    this.edit$
      .pipe(takeUntilDestroyed())
      .subscribe((update) =>
        this.checklists.update((checklists) =>
          checklists.map((checklist) =>
            checklist.id === update.id ? { ...checklist, title: update.data.title } : checklist,
          ),
        ),
      );

    this.remove$
      .pipe(takeUntilDestroyed())
      .subscribe((id) =>
        this.checklists.update((checklists) =>
          checklists.filter((checklist) => checklist.id !== id),
        ),
      );

    effect(() => {
      const checklist = this.checklists();

      if (this.loadedChecklists.status() === 'resolved') {
        this.storageService.saveChecklists(checklist);
      }
    });
  }

  private addIdToCheckList(checklist: AddChecklist) {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  private generateSlug(title: string) {
    let slug = title.toLowerCase().replace(/\\s+/g, '-');

    const matchingSlugs = this.checklists().find((checklist) => checklist.id === slug);

    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
