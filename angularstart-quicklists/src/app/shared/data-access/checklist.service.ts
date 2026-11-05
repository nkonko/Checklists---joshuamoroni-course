import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AddChecklist, Checklist, EditChecklist } from '../interfaces/checklist';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';
import { ChecklistItemService } from './checklist-item.service';

interface ChecklistState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  checklistItemService = inject(ChecklistItemService);
  storageService = inject(StorageService);

  private state = signal<ChecklistState>({
    checklists: [],
    loaded: false,
    error: null,
  });

  checklists = computed(() => this.state().checklists);
  loaded = computed(() => this.state().loaded);
  remove$ = this.checklistItemService.checklistRemoved$;

  private checklistLoaded$ = this.storageService.loadChecklist();

  add$ = new Subject<AddChecklist>();
  edit$ = new Subject<EditChecklist>();

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      this.state.update((state) => ({
        ...state,
        checklists: [...state.checklists, this.addIdToCheckList(checklist)],
      })),
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((update) =>
      this.state.update((state) => ({
        ...state,
        checklists: state.checklists.map((checklist) =>
          checklist.id === update.id ? { ...checklist, title: update.data.title } : checklist,
        ),
      })),
    );

    this.remove$.pipe(takeUntilDestroyed()).subscribe((id) =>
      this.state.update((state) => ({
        ...state,
        checklists: state.checklists.filter((checklist) => checklist.id !== id),
      })),
    );

    this.checklistLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklists) =>
        this.state.update((state) => ({
          ...state,
          checklists,
        })),
      error: (err) => this.state.update((state) => ({ ...state, error: err })),
    });

    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklists(this.checklists());
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
