import { CoresModule } from '../../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { IonicModule } from '@ionic/angular';

import { HomeWorkPageRoutingModule } from './home-work-routing.module';

import { HomeWorkPage } from './home-work.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CoresModule,
        NgxIonicImageViewerModule,
        HomeWorkPageRoutingModule,
        ComponentsModule
    ],
    declarations: [HomeWorkPage]
})
export class HomeWorkPageModule { }
