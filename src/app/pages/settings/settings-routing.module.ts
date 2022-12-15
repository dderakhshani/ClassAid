import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
  },  {
    path: 'students-setting',
    loadChildren: () => import('./students-setting/students-setting.module').then( m => m.StudentsSettingPageModule)
  },
  {
    path: 'lessons-setting',
    loadChildren: () => import('./lessons-setting/lessons-setting.module').then( m => m.LessonsSettingPageModule)
  },
  {
    path: 'paramters-setting',
    loadChildren: () => import('./paramters-setting/paramters-setting.module').then( m => m.ParamtersSettingPageModule)
  },
  {
    path: 'rings-setting',
    loadChildren: () => import('./rings-setting/rings-setting.module').then( m => m.RingsSettingPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsPageRoutingModule {}
