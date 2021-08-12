import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductMasterComponent } from './product-master/product-master.component';

const routes: Routes = [
  {
    path: 'list',
    component: ProductListComponent
  },
  {
    path: 'master/:id',
    component: ProductMasterComponent
  },
  {
    path: 'master',
    component: ProductMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
