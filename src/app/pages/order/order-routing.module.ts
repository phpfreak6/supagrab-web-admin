import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderMasterComponent } from './order-master/order-master.component';

const routes: Routes = [
  {
    path: 'list',
    component: OrderListComponent
  },
  {
    path: 'master/:id',
    component: OrderMasterComponent
  },
  {
    path: 'master',
    component: OrderMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
