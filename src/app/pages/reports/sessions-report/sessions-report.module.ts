import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionsReportPageRoutingModule } from './sessions-report-routing.module';

import { SessionsReportPage } from './sessions-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionsReportPageRoutingModule
  ],
  declarations: [SessionsReportPage]
})
export class SessionsReportPageModule {}
