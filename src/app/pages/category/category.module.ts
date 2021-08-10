import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryMasterComponent } from './category-master/category-master.component';


@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryMasterComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    ReactiveFormsModule
  ]
})
export class CategoryModule { }
