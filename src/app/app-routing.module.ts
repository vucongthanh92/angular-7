import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptViewComponent } from './receipt-view/receipt-view.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ReceiptViewComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'receipt',
    canActivate: [AuthGuard],
    component: ReceiptViewComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class RoutingModule { }
