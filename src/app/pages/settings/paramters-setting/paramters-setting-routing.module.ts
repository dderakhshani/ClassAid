import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamtersSettingPage } from './paramters-setting.page';

const routes: Routes = [
  {
    path: '',
    component: ParamtersSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParamtersSettingPageRoutingModule {}
