import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared.module';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        HomePageRoutingModule,
        SharedModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
    ],
    declarations: [
        HomePage,
    ]
})
export class HomeModule { }
