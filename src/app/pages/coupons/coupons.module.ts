import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponListComponent } from './coupon-list/coupon-list.component';
import { CouponMasterComponent } from './coupon-master/coupon-master.component';


@NgModule({
  declarations: [
    CouponListComponent,
    CouponMasterComponent
  ],
  imports: [
    CommonModule,
    CouponsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CouponsModule { }
