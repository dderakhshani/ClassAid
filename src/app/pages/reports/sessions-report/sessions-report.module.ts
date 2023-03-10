import { CoresModule } from './../../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionsReportPageRoutingModule } from './sessions-report-routing.module';

import { SessionsReportPage } from './sessions-report.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CoresModule,
        TranslateModule,
        SessionsReportPageRoutingModule
    ],
    declarations: [SessionsReportPage]
})
export class SessionsReportPageModule { }
