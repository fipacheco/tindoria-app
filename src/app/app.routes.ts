import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login-component/login-component').then((m) => m.LoginComponent),
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./cadastro-component/cadastro-component').then((m) => m.CadastroComponent),
  },
  {
    path: 'home/:status/:id',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'subject/:id',
    loadComponent: () =>
      import('./subject/subject.component').then((m) => m.SubjectComponent),
  },
  {
    path: 'profile/:status/:id',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
  },
];
