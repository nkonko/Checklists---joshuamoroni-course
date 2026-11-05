import { computed, Injectable, signal } from "@angular/core";
import { AddChecklistItem, ChecklistItem, RemoveChecklistItem } from "../interfaces/checklistItem";
import { Subject } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RemoveChecklist } from "../interfaces/checklist";

interface ChecklistItemState {
    checklistItems: ChecklistItem[]
}

@Injectable({
    providedIn:'root'
})

export class ChecklistItemService {
    private state = signal<ChecklistItemState>({
        checklistItems: []
    });

    checklistItems = computed(() => this.state().checklistItems);

    add$ = new Subject<AddChecklistItem>();
    toggle$ = new Subject<RemoveChecklistItem>();
    reset$ = new Subject<RemoveChecklist>();

    constructor() {
        this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem) => 
        this.state.update((state) => ({
            ...state,
            checklistItems: [
                ...state.checklistItems, 
                {
                    ...checklistItem.item,
                    id: Date.now().toString(),
                    checklistId: checklistItem.checklistId,
                    checked: false
                }
            ]
        })))

        this.toggle$.pipe(takeUntilDestroyed()).subscribe((checklistItemId) => 
        this.state.update((state) => ({
            ...state,
            checklistItems: state.checklistItems.map((item) => 
            item.id === checklistItemId 
            ? {...item, checked: !item.checked} 
            : item )
        })))

        this.reset$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
        this.state.update((state) => ({
            ...state,
            checklistItems: state.checklistItems.map((item) => 
            item.checklistId === checklistId 
            ? {...item, checked: false} 
            : item )
        })))

    }
} 
