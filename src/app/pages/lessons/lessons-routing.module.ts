import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonsPage } from './lessons.page';

const routes: Routes = [
  {
    path: '',
    component: LessonsPage
  },
  {
    path: 'details',
    loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonsPageRoutingModule {}
