import { Routes } from '@angular/router';
import {AuthLayoutComponent} from "./features/authentication/layout/auth-layout/auth-layout.component";
import {SignInComponent} from "./features/authentication/components/sign-in/sign-in.component";
import {DashboardLayoutComponent} from "./features/dashboard/layout/dashboard-layout/dashboard-layout.component";
import {authGuard} from "./core/guards/auth.guard";
import {SignUpComponent} from "./features/authentication/components/sign-up/sign-up.component";
import {ChatComponent} from "./features/dashboard/components/chat/chat.component";

export const routes: Routes = [
  {
    component: DashboardLayoutComponent,
    path: '',
    canActivateChild: [
      authGuard
    ],
    children: [
      {
        component: ChatComponent,
        path: 'chat',
        pathMatch: 'full'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'chat'
      }
    ]
  },
  {
    component: AuthLayoutComponent,
    path: 'auth',
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
        pathMatch: 'full'
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in',
      },
    ]
  }
];
