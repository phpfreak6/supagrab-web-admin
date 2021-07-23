import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SiteSettingsRoutingModule } from './site-settings-routing.module';
import { SiteSettingsListComponent } from './site-settings-list/site-settings-list.component';
import { SiteSettingsMasterComponent } from './site-settings-master/site-settings-master.component';


@NgModule({
  declarations: [
    SiteSettingsListComponent,
    SiteSettingsMasterComponent
  ],
  imports: [
    CommonModule,
    SiteSettingsRoutingModule,
    ReactiveFormsModule
  ]
})
export class SiteSettingsModule { }
