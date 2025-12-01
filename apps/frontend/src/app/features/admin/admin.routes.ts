import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
];
