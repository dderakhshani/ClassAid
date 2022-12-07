import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RulesAgreementPageRoutingModule } from './rules-agreement-routing.module';

import { RulesAgreementPage } from './rules-agreement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RulesAgreementPageRoutingModule
  ],
  declarations: [RulesAgreementPage]
})
export class RulesAgreementPageModule {}
