import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal/modal-component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormModalComponent } from '../shared/ui/form-modal/form-modal-component';
import { FormBuilder, Validators } from '@angular/forms';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ChecklistListComponent } from './ui/checklist-list/checklist-list.component';

@Component({
  imports: [ModalComponent, FormModalComponent, ChecklistListComponent],
  selector: 'app-home-component',
  styles: ``,
  template: `
   <header>
    <h1>Quicklists</h1>
    <button (click)="checklistBeingEdited.set({})">Add Quicklist</button>
   </header>

   <app-modal [isOpen]="!!checklistBeingEdited()">
    <ng-template>
    <app-form-modal-component 
    [formGroup]="checkListForm" 
    [title]="checklistBeingEdited()?.title 
             ? checklistBeingEdited()!.title!
             : 'Add Checklist' " 
    (close)="checklistBeingEdited.set(null)" 
    (save)="checklistService.add$.next(checkListForm.getRawValue())"></app-form-modal-component>
    </ng-template>
   </app-modal>

   <app-checklist-list [checklistList]="checklistService.checklists()"></app-checklist-list>
   `,
})
export default class HomeComponent {
  fb = inject(FormBuilder);
  checklistService = inject(ChecklistService);
  checklistBeingEdited = signal<Partial<Checklist> | null>(null);
  checkListForm = this.fb.nonNullable.group({
    title: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const checklist = this.checklistBeingEdited();

      if(!checklist) {
        this.checkListForm.reset();
      }
    })
  }
}
