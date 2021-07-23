import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DepartmentListComponent } from "./department-list/department-list.component";
import { DepartmentMasterComponent } from "./department-master/department-master.component";

const routes: Routes = [
  {
    path: 'list',
    component: DepartmentListComponent
  },
  {
    path: 'master/:id',
    component: DepartmentMasterComponent
  },
  {
    path: 'master',
    component: DepartmentMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
