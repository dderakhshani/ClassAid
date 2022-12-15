import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentsSettingPage } from './students-setting.page';

const routes: Routes = [
  {
    path: '',
    component: StudentsSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsSettingPageRoutingModule {}
