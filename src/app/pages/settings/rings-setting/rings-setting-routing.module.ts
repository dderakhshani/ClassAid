import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RingsSettingPage } from './rings-setting.page';

const routes: Routes = [
  {
    path: '',
    component: RingsSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RingsSettingPageRoutingModule {}
