import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchedulePage } from './schedule.page';

const routes: Routes = [
    {
        path: '',
        component: SchedulePage
    },
    {
        path: 'edit',
        loadChildren: () => import('./edit-schedule/edit-schedule.module').then(m => m.EditSchedulePageModule)
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SchedulePageRoutingModule { }
