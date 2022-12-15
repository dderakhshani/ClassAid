import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RingsSettingPageRoutingModule } from './rings-setting-routing.module';

import { RingsSettingPage } from './rings-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RingsSettingPageRoutingModule
  ],
  declarations: [RingsSettingPage]
})
export class RingsSettingPageModule {}
