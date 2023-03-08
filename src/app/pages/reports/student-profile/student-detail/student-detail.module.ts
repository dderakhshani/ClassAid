import { CoresModule } from './../../../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentDetailPageRoutingModule } from './student-detail-routing.module';

import { StudentDetailPage } from './student-detail.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CoresModule,
        TranslateModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
        StudentDetailPageRoutingModule
    ],
    declarations: [StudentDetailPage]
})
export class StudentDetailPageModule { }
