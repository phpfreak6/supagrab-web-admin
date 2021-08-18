import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { ProductImageMasterComponent } from './product-image-master/product-image-master.component';
import { ProductAttributesListComponent } from './product-attributes-list/product-attributes-list.component';
import { ProductAttributesMasterComponent } from './product-attributes-master/product-attributes-master.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductMasterComponent,
    ProductImageMasterComponent,
    ProductAttributesListComponent,
    ProductAttributesMasterComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    CKEditorModule
  ]
})
export class ProductModule { }
