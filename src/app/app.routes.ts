import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'add-contact',
    loadComponent: () => import('./add-contact/add-contact.page').then( m => m.AddContactPage)
  },
  {
    path: 'update-contact/:id',
    loadComponent: () => import('./update-contact/update-contact.page').then( m => m.UpdateContactPage)
  },
];
