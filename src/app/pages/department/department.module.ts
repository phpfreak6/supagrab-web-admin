import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentMasterComponent } from './department-master/department-master.component';


@NgModule({
  declarations: [
    DepartmentListComponent,
    DepartmentMasterComponent
  ],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    ReactiveFormsModule
  ]
})
export class DepartmentModule { }
