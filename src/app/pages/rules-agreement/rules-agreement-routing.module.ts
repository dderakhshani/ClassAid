import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RulesAgreementPage } from './rules-agreement.page';

const routes: Routes = [
  {
    path: '',
    component: RulesAgreementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RulesAgreementPageRoutingModule {}
