import { CoresModule } from './../../core/core.module';
import { ScoreComponent } from './score/score.component';
import { ReminderComponent } from './reminder/reminder.component';
import { NoteComponent } from './note/note.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassPageRoutingModule } from './class-routing.module';

import { ClassPage } from './class.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ClassPageRoutingModule,
        CoresModule
    ],
    declarations: [ClassPage, NoteComponent, ReminderComponent, ScoreComponent]
})
export class ClassPageModule { }
