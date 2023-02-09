import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentReportPageRoutingModule } from './assessment-report-routing.module';

import { AssessmentReportPage } from './assessment-report.page';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AssessmentReportPageRoutingModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
    ],
    declarations: [AssessmentReportPage]
})
export class AssessmentReportPageModule { }
