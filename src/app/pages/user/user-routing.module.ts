import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserListComponent } from "./user-list/user-list.component";
import { UserMasterComponent } from "./user-master/user-master.component";
// import { AddressListComponent } from "./address-list/address-list.component";
// import { AddressListMasterComponent } from "./address-list-master/address-list-master.component";

const routes: Routes = [
  {
    path: 'list',
    component: UserListComponent
  },
  {
    path: 'master/:id',
    component: UserMasterComponent
  },
  {
    path: 'master',
    component: UserMasterComponent
  },
  // {
  //   path: 'address-list/:userId',
  //   component: AddressListComponent
  // },
  // {
  //   path: 'address-list/:userId/master/:id',
  //   component: AddressListMasterComponent
  // },
  // {
  //   path: 'address-list/:userId/master',
  //   component: AddressListMasterComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
