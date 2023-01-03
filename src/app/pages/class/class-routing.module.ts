import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassPage } from './class.page';

const routes: Routes = [
    {
        path: ':lessonId',
        component: ClassPage
    },

    {
        path: 'assessment',
        loadChildren: () => import('../assessment/assessment.module').then(m => m.AssessmentPageModule)
    },
    {
        path: 'select-students',
        loadChildren: () => import('../select-students/select-students.module').then(m => m.SelectStudentsPageModule)
    },
    {
        path: ':lessonId/:scheduleId',
        component: ClassPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassPageRoutingModule { }
