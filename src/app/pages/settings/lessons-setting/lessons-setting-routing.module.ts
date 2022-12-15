import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonsSettingPage } from './lessons-setting.page';

const routes: Routes = [
  {
    path: '',
    component: LessonsSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonsSettingPageRoutingModule {}
