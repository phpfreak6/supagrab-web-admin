import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponListComponent } from './coupon-list/coupon-list.component';
import { CouponMasterComponent } from './coupon-master/coupon-master.component';

const routes: Routes = [
  {
    path: 'list',
    component: CouponListComponent
  },
  {
    path: 'master/:id',
    component: CouponMasterComponent
  },
  {
    path: 'master',
    component: CouponMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
