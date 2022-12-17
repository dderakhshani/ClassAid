import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSchedulePage } from './edit-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: EditSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSchedulePageRoutingModule {}
