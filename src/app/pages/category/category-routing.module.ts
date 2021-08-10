import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryMasterComponent } from './category-master/category-master.component';

const routes: Routes = [
  {
    path: 'list',
    component: CategoryListComponent
  },
  {
    path: 'master/:id',
    component: CategoryMasterComponent
  },
  {
    path: 'master',
    component: CategoryMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
