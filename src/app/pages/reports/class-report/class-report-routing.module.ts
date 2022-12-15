import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassReportPage } from './class-report.page';

const routes: Routes = [
    {
        path: ':sessionId',
        component: ClassReportPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassReportPageRoutingModule { }
