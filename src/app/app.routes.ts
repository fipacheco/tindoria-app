import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login/aluno',
    pathMatch: 'full',
  },
  {
    path: 'login/aluno',
    loadComponent: () =>
      import('./login-component/login-component').then((m) => m.LoginComponent),
  },
];
