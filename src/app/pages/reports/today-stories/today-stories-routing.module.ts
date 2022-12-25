import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodayStoriesPage } from './today-stories.page';

const routes: Routes = [
  {
    path: '',
    component: TodayStoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodayStoriesPageRoutingModule {}
