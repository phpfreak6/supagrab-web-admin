import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	FormGroup,
	FormControl,
	Validators,
	FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import Swal from 'sweetalert2';

import { ConstantService } from "../../../services/constant.service";
import { OrderService } from "../../../services/order.service";

import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-order-list',
	templateUrl: './order-list.component.html',
	styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {

	public orderSearchForm: FormGroup;
	public isAuthLoading = false;
	public submitted = false;

	public orders;
	public txtSearch;

	private orderSubscription: Subscription;

	constructor(
		private toastr: ToastrService,
		private appService: AppService,
		private constantService: ConstantService,
		private orderService: OrderService,
		private router: Router,
		private ngxSpinnerService: NgxSpinnerService
	) { }

	ngOnInit(): void {
		
		this.orderSearchForm = new FormGroup({
			searchTxt: new FormControl(null, Validators.required)
		});

		this.getAllOrders(this.txtSearch);
	}

	getAllOrders(txtSearch) {
		try {

			this.ngxSpinnerService.show();
			this.orderSubscription = this.orderService.getAllOrders(this.txtSearch).subscribe(
				(result) => {
					if (result.success) {
						// this.toastr.success( result.message, 'Success!');
						// this.router.navigate(['/orders/list']);
						this.orders = result.data.order;
					} else {
						// this.toastr.error( result.errorArr[0], 'Request Error!');
						this.constantService.handleResCode(result);
					}
				},
				(error) => {

					this.ngxSpinnerService.hide();
					console.log(error.message);
					let obj = {
						resCode: 400,
						msg: error.message.toString(),
					};
					this.constantService.handleResCode(obj);
				},
				() => {
					// inside complete
					this.ngxSpinnerService.hide();
				}
			);
		} catch (ex) {

			this.ngxSpinnerService.hide();
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	searchOrder(txtSearch) {

		try {

			this.txtSearch = txtSearch;
			console.log('txtSearch', txtSearch);
			this.getAllOrders(txtSearch);
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	identify( index, item ) {
		return item.department_title;
	}

	public ngOnDestroy(): void {

        if (this.orderSubscription) {
            this.orderSubscription.unsubscribe();
        }
    }
}
