import { ProfilePageModule } from './../profile/profile.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
            },
            {
                path: 'schedule',
                loadChildren: () => import('../schedule/schedule.module').then(m => m.SchedulePageModule)
            },
            {
                path: 'reports',
                loadChildren: () => import('../reports/reports.module').then(m => m.ReportsPageModule)
            },
            {
                path: 'class',
                loadChildren: () => import('../class/class.module').then(m => m.ClassPageModule)
            },
            {
                path: 'lessons',
                loadChildren: () => import('../lessons/lessons.module').then(m => m.LessonsPageModule)
            },
            {
                path: 'assessment',
                loadChildren: () => import('../assessment/assessment.module').then(m => m.AssessmentPageModule)
            },
            {
                path: 'home-work',
                loadChildren: () => import('../assessment/home-work/home-work.module').then(m => m.HomeWorkPageModule)
            },
            {
                path: '',
                redirectTo: '/tabs/home',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
