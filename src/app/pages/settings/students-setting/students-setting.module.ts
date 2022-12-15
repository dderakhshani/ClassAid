import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentsSettingPageRoutingModule } from './students-setting-routing.module';

import { StudentsSettingPage } from './students-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentsSettingPageRoutingModule
  ],
  declarations: [StudentsSettingPage]
})
export class StudentsSettingPageModule {}
