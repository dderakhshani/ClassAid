import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentPageRoutingModule } from './assessment-routing.module';

import { AssessmentPage } from './assessment.page';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AssessmentPageRoutingModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
    ],
    declarations: [AssessmentPage]
})
export class AssessmentPageModule { }
