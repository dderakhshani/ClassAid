import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxEchartsModule } from 'ngx-echarts';
import { ComponentsModule } from './components/components.module';


@NgModule({
    imports: [CommonModule, IonicModule,
        FormsModule,
        ComponentsModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
    ],
    declarations: [],
    exports: [ComponentsModule, NgxEchartsModule
    ],

})
export class SharedModule { }
