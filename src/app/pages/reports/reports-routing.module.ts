import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsPage } from './reports.page';

const routes: Routes = [
    {
        path: '',
        component: ReportsPage
    },
    {
        path: 'attendance-report',
        loadChildren: () => import('./attendance-report/attendance-report.module').then(m => m.AttendanceReportPageModule)
    },
    {
        path: 'student-profile',
        loadChildren: () => import('./student-profile/student-profile.module').then(m => m.StudentProfilePageModule)
    },
    {
        path: 'assessment-report',
        loadChildren: () => import('./assessment-report/assessment-report.module').then(m => m.AssessmentReportPageModule)
    },
    {
        path: 'sessions-report',
        loadChildren: () => import('./sessions-report/sessions-report.module').then(m => m.SessionsReportPageModule)
    },
    {
        path: 'reminders-report',
        loadChildren: () => import('./reminders-report/reminders-report.module').then(m => m.RemindersReportPageModule)
    },
    {
        path: 'homeworks-report',
        loadChildren: () => import('./homeworks-report/homeworks-report.module').then(m => m.HomeworksReportPageModule)
    },
    {
        path: 'class-report',
        loadChildren: () => import('./class-report/class-report.module').then(m => m.ClassReportPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportsPageRoutingModule { }
