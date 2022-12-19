import { CoresModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeWorkPageRoutingModule } from './home-work-routing.module';

import { HomeWorkPage } from './home-work.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CoresModule,
        HomeWorkPageRoutingModule
    ],
    declarations: [HomeWorkPage]
})
export class HomeWorkPageModule { }
