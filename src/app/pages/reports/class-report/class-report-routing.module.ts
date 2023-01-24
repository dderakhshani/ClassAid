import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassReportPage } from './class-report.page';

const routes: Routes = [
    {
        path: ':sessionId',
        component: ClassReportPage
    },
    {
        path: 'home-work',
        loadChildren: () => import('../../assessment/home-work/home-work.module').then(m => m.HomeWorkPageModule)
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassReportPageRoutingModule { }
