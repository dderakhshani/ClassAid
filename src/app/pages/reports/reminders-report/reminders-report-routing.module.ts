import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemindersReportPage } from './reminders-report.page';

const routes: Routes = [
  {
    path: '',
    component: RemindersReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemindersReportPageRoutingModule {}
