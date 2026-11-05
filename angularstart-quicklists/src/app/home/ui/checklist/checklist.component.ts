import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistHeaderComponent } from '../checklist-header/checklist-header.component';
import { FormBuilder } from '@angular/forms';
import { ChecklistItem } from '../../../shared/interfaces/checklistItem';
import { ModalComponent } from '../../../shared/ui/modal/modal-component';
import { FormModalComponent } from '../../../shared/ui/form-modal/form-modal-component';
import { ChecklistItemService } from '../../../shared/data-access/checklist-item.service';
import { ChecklistService } from '../../../shared/data-access/checklist.service';
import { ChecklistItemListComponent } from '../checklist-item-list/checklist-item-list.component';

@Component({
  imports: [ChecklistHeaderComponent, ModalComponent, FormModalComponent, ChecklistItemListComponent],
  selector: 'app-checklist',
  styles: ``,
  template: ` 
  @if (checklist(); as checklist){
  <app-checklist-header 
  [checklist]="checklist" 
  (addItem)="checklistItemIsBeingEdited.set({})"
  (resetChecklist)="checklistItemService.reset$.next($event)" />
}
<app-modal [isOpen] = "!!checklistItemIsBeingEdited()">
  <ng-template>
    <app-form-modal
    title="Create item"
    [formGroup]="checklistItemForm"
    (save)="checklistItemService.add$.next({
      item:checklistItemForm.getRawValue(),
      checklistId: checklist()?.id!,
      })"
      (close)="checklistItemIsBeingEdited.set(null)"
      >
      
    </app-form-modal>
  </ng-template>
</app-modal>

<app-checklist-item-list 
[checklistItems]="items()" 
(toggle)="checklistItemService.toggle$.next($event)"/>
   `,
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  checklistItemIsBeingEdited = signal<Partial<ChecklistItem> | null>(null);

  params = toSignal(this.route.paramMap);

  checklist = computed(() => 
    this.checklistService
  .checklists()
  .find((checklist) => checklist.id === this.params()?.get('id'))
  );

    items = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter((item) => item.checklistId === this.params()?.get('id'))
  );

  checklistItemForm = this.fb.nonNullable.group({
    title: ['']
  });

  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemIsBeingEdited()
      
      if(!checklistItem){
        this.checklistItemForm.reset();
      }
    })
  }
}
