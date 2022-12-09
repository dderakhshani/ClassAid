import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchedulePageRoutingModule } from './schedule-routing.module';

import { SchedulePage } from './schedule.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TimelineComponent } from './timeline/timeline.component';
import { TableComponent } from './table/table.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SchedulePageRoutingModule,
    ],
    declarations: [SchedulePage, TimelineComponent, TableComponent]
})
export class SchedulePageModule { }
