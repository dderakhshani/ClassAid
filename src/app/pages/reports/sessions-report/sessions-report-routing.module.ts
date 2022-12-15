import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionsReportPage } from './sessions-report.page';

const routes: Routes = [
  {
    path: '',
    component: SessionsReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsReportPageRoutingModule {}
