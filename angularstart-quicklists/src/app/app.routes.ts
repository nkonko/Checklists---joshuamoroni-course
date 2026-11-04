import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'home',
        loadComponent: () => import('./home/home-component')
    },
    {
        path:'checklist/:id',
        loadComponent: () => import('./home/ui/checklist/checklist.component')
    },
    {
        path:'',
        pathMatch:'full',
        redirectTo:'home'
    }
];
