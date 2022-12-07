import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupPage } from './signup.page';
import { VerificationCodeComponent } from './verification-code/verification-code.component';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
  },
  {
    path: 'verification',
    component : VerificationCodeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPageRoutingModule {}
