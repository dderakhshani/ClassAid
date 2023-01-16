import { StoryItemComponent } from './story-item/story-item.component';
import { SelectStudentComponent } from './select-student/select-student.component';
import { CoresModule } from './../core/core.module';
import { HomeWorkItemComponent } from './home-work-item/home-work-item.component';
import { ScheduleItemComponent } from './schedule-item/schedule-item.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TimelineComponent } from './timeline/timeline.component';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CoresModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
    ],
    declarations: [TimelineComponent,
        ScheduleItemComponent,
        HomeWorkItemComponent,
        SelectStudentComponent,
        StoryItemComponent
    ],
    exports: [TimelineComponent, ScheduleItemComponent, HomeWorkItemComponent, SelectStudentComponent, StoryItemComponent]
})
export class ComponentsModule { }
