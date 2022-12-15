import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeworksReportPage } from './homeworks-report.page';

const routes: Routes = [
  {
    path: '',
    component: HomeworksReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeworksReportPageRoutingModule {}
