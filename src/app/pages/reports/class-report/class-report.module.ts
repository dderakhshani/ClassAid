import { CoresModule } from './../../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassReportPageRoutingModule } from './class-report-routing.module';

import { ClassReportPage } from './class-report.page';
import { ClassPageModule } from '../../class/class.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ClassReportPageRoutingModule,
        CoresModule,
        ComponentsModule,
        ClassPageModule,
        TranslateModule
    ],
    declarations: [ClassReportPage]
})
export class ClassReportPageModule { }
