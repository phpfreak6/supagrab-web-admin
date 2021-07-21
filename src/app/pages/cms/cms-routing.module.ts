import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CmsListComponent } from "./cms-list/cms-list.component";
import { CmsMasterComponent } from "./cms-master/cms-master.component";

const routes: Routes = [
  {
    path: 'list',
    component: CmsListComponent
  },
  {
    path: 'master/:id',
    component: CmsMasterComponent
  },
  {
    path: 'master',
    component: CmsMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
