import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionComponent }     from './components/session.component';

const appRoutes: Routes = [
  {
    path: 'sessions/:id',
    component: SessionComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);