import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentReportPageRoutingModule } from './assessment-report-routing.module';

import { AssessmentReportPage } from './assessment-report.page';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AssessmentReportPageRoutingModule,
        TranslateModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
    ],
    declarations: [AssessmentReportPage]
})
export class AssessmentReportPageModule { }
