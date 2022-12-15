import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemindersReportPageRoutingModule } from './reminders-report-routing.module';

import { RemindersReportPage } from './reminders-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemindersReportPageRoutingModule
  ],
  declarations: [RemindersReportPage]
})
export class RemindersReportPageModule {}
