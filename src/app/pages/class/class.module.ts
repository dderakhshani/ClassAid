
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

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ClassPageRoutingModule,
        CoresModule,
        ComponentsModule
    ],
    declarations: [ClassPage, NoteComponent, ReminderComponent, ScoreComponent, CreateHomeWorkComponent]
})
export class ClassPageModule { }
