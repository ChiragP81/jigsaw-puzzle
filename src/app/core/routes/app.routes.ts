import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../pages/pages.component').then((m) => m.PagesComponent),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
