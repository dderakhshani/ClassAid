
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxEchartsModule } from 'ngx-echarts';
import { ComponentsModule } from './components/components.module';
import { JalaliPipe } from './pipes/jalali-pipe';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsModule,
    ],
    declarations: [JalaliPipe],
    exports: [ComponentsModule, JalaliPipe]
})
export class CoresModule { }
