import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/gaurds/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    },
    {
        path: 'tabs',
        loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'signin',
        loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule),

    },
    // {
    //     path: 'welcome',
    //     loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule),
    //     canLoad: [WelcomeGuard]
    // },
    {
        path: 'profile',
        canLoad: [AuthGuard],
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
    },
    {
        path: 'rules-agreement',
        loadChildren: () => import('./pages/rules-agreement/rules-agreement.module').then(m => m.RulesAgreementPageModule)
    },
    {
        path: 'schedule',
        loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.SchedulePageModule)
    },
    {
        path: 'reports',
        loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsPageModule)
    },
    {
        path: 'class',
        loadChildren: () => import('./pages/class/class.module').then(m => m.ClassPageModule)
    },
    {
        path: 'lessons',
        loadChildren: () => import('./pages/lessons/lessons.module').then(m => m.LessonsPageModule)
    },
    {
        path: 'assessment',
        loadChildren: () => import('./pages/assessment/assessment.module').then(m => m.AssessmentPageModule)
    },
    {
        path: 'attendance',
        loadChildren: () => import('./pages/attendance/attendance.module').then(m => m.AttendancePageModule)
    },
    {
        path: 'home-work',
        loadChildren: () => import('./pages/assessment/home-work/home-work.module').then(m => m.HomeWorkPageModule)
    },  {
    path: 'select-students',
    loadChildren: () => import('./pages/select-students/select-students.module').then( m => m.SelectStudentsPageModule)
  }


];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
