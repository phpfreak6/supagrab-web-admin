import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FaqListComponent } from "./faq-list/faq-list.component";
import { FaqMasterComponent } from "./faq-master/faq-master.component";

const routes: Routes = [
  {
    path: 'list',
    component: FaqListComponent
  },
  {
    path: 'master/:id',
    component: FaqMasterComponent
  },
  {
    path: 'master',
    component: FaqMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
