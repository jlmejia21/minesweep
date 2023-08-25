import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'game-setup',
    loadComponent: () =>
      import('./game-setup/game-setup.component').then(
        (m) => m.GameSetupComponent
      ),
  },
  {
    path: 'finished-list',
    loadComponent: () =>
      import('./finished-list/finished-list.component').then(
        (m) => m.FinishedListComponent
      ),
  },
  { path: '', redirectTo: '/game-setup', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
