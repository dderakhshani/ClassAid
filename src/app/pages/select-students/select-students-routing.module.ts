import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectStudentsPage } from './select-students.page';

const routes: Routes = [
  {
    path: '',
    component: SelectStudentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectStudentsPageRoutingModule {}
