import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSchedulePageRoutingModule } from './edit-schedule-routing.module';

import { EditSchedulePage } from './edit-schedule.page';
import { TimelineComponent } from './timeline/timeline.component';
import { TableComponent } from './table/table.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EditSchedulePageRoutingModule,
        TranslateModule
    ],
    declarations: [EditSchedulePage, TimelineComponent, TableComponent,]
})
export class EditSchedulePageModule { }
