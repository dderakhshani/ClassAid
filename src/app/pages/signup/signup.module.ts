import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { VerificationCodeComponent } from './verification-code/verification-code.component';
import { MultiInputComponent } from '../../core/components/multi-input/multi-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupPageRoutingModule,
  ],
  declarations: [SignupPage, VerificationCodeComponent, MultiInputComponent],

})
export class SignupPageModule { }
