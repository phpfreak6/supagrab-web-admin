import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { ProductImageMasterComponent } from './product-image-master/product-image-master.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductMasterComponent,
    ProductImageMasterComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
