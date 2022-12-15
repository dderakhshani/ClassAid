import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassReportPageRoutingModule } from './class-report-routing.module';

import { ClassReportPage } from './class-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassReportPageRoutingModule
  ],
  declarations: [ClassReportPage]
})
export class ClassReportPageModule {}
