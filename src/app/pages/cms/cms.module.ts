import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CmsRoutingModule } from './cms-routing.module';
import { CmsListComponent } from './cms-list/cms-list.component';
import { CmsMasterComponent } from './cms-master/cms-master.component';
import { NgxEditorModule } from 'ngx-editor';


@NgModule({
  declarations: [
    CmsListComponent,
    CmsMasterComponent
  ],
  imports: [
    CommonModule,
    CmsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEditorModule,
  ]
})
export class CmsModule { }
