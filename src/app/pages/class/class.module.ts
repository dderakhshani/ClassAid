
import { CoresModule } from './../../core/core.module';
import { ScoreComponent } from './score/score.component';
import { ReminderComponent } from './reminder/reminder.component';
import { NoteComponent } from './note/note.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassPageRoutingModule } from './class-routing.module';

import { ClassPage } from './class.page';
import { CreateHomeWorkComponent } from './create-home-work/create-home-work.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CreateGroupComponent } from './create-group/create-group.component';
import { RandomStudentComponent } from './random-student/random-student.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ClassPageRoutingModule,
        CoresModule,
        ComponentsModule,

        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 0,
            animation: false,
            showTitle: false,
            showSubtitle: false,
            showUnits: false
        }),
        TranslateModule,
    ],
    declarations: [ClassPage,
        NoteComponent,
        ReminderComponent,
        ScoreComponent,
        CreateHomeWorkComponent,
        CreateGroupComponent,
        RandomStudentComponent],
    providers: [],
    exports: [NoteComponent, ReminderComponent,
        ScoreComponent,
        CreateHomeWorkComponent,]
})
export class ClassPageModule { }
