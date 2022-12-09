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
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
    ],
    declarations: [TimelineComponent],
    exports: [TimelineComponent]
})
export class ComponentsModule { }
