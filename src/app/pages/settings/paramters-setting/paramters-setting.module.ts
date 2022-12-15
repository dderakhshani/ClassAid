import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParamtersSettingPageRoutingModule } from './paramters-setting-routing.module';

import { ParamtersSettingPage } from './paramters-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParamtersSettingPageRoutingModule
  ],
  declarations: [ParamtersSettingPage]
})
export class ParamtersSettingPageModule {}
