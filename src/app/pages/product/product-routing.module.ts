import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductAttributesListComponent } from './product-attributes-list/product-attributes-list.component';
import { ProductAttributesMasterComponent } from './product-attributes-master/product-attributes-master.component';
import { ProductImageMasterComponent } from './product-image-master/product-image-master.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductMasterComponent } from './product-master/product-master.component';

const routes: Routes = [
  {
    path: ':productId/attributes/list',
    component: ProductAttributesListComponent
  },
  {
    path: ':productId/attributes/master/:id',
    component: ProductAttributesMasterComponent
  },
  {
    path: ':productId/attributes/master',
    component: ProductAttributesMasterComponent
  },
  {
    path: 'list',
    component: ProductListComponent
  },
  {
    path: 'master/:id/images',
    component: ProductImageMasterComponent
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
