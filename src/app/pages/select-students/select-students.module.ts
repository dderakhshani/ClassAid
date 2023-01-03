import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectStudentsPageRoutingModule } from './select-students-routing.module';

import { SelectStudentsPage } from './select-students.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectStudentsPageRoutingModule
  ],
  declarations: [SelectStudentsPage]
})
export class SelectStudentsPageModule {}
