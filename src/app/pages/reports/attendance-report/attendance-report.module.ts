import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceReportPageRoutingModule } from './attendance-report-routing.module';

import { AttendanceReportPage } from './attendance-report.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AttendanceReportPageRoutingModule,
        TranslateModule
    ],
    declarations: [AttendanceReportPage]
})
export class AttendanceReportPageModule { }
