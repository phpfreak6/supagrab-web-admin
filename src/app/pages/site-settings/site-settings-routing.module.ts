import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SiteSettingsListComponent } from "../site-settings/site-settings-list/site-settings-list.component";
import { SiteSettingsMasterComponent } from "../site-settings/site-settings-master/site-settings-master.component";

const routes: Routes = [
  {
    path: 'list',
    component: SiteSettingsListComponent
  },
  {
    path: 'master/:id',
    component: SiteSettingsMasterComponent
  },
  {
    path: 'master',
    component: SiteSettingsMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteSettingsRoutingModule { }
