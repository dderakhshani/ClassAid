import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentReportPage } from './assessment-report.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentReportPageRoutingModule {}
