import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonsSettingPageRoutingModule } from './lessons-setting-routing.module';

import { LessonsSettingPage } from './lessons-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonsSettingPageRoutingModule
  ],
  declarations: [LessonsSettingPage]
})
export class LessonsSettingPageModule {}
