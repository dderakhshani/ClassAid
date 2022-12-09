import { SharedModule } from './../../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentPageRoutingModule } from './assessment-routing.module';

import { AssessmentPage } from './assessment.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AssessmentPageRoutingModule,
        SharedModule
    ],
    declarations: [AssessmentPage]
})
export class AssessmentPageModule { }
