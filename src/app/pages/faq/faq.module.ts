import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqMasterComponent } from './faq-master/faq-master.component';


@NgModule({
  declarations: [
    FaqListComponent,
    FaqMasterComponent
  ],
  imports: [
    CommonModule,
    FaqRoutingModule,
    ReactiveFormsModule
  ]
})
export class FaqModule { }
