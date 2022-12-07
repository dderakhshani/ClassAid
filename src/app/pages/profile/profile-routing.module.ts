import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
    {
        path: '',
        component: ProfilePage
    },
    {
        path: 'user-profile',
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfilePageModule)
    },
    {
        path: 'help',
        loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule)
    },
    {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfilePageRoutingModule { }
