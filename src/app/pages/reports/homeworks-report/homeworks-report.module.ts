import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeworksReportPageRoutingModule } from './homeworks-report-routing.module';

import { HomeworksReportPage } from './homeworks-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeworksReportPageRoutingModule
  ],
  declarations: [HomeworksReportPage]
})
export class HomeworksReportPageModule {}
