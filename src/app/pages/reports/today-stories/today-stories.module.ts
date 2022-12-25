import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodayStoriesPageRoutingModule } from './today-stories-routing.module';

import { TodayStoriesPage } from './today-stories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodayStoriesPageRoutingModule
  ],
  declarations: [TodayStoriesPage]
})
export class TodayStoriesPageModule {}
