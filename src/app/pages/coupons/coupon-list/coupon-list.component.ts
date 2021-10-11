import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	FormGroup,
	FormControl,
	Validators,
	FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import Swal from 'sweetalert2';

import { ConstantService } from "../../../services/constant.service";
import { CouponService } from '../../../services/coupon.service';

import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-coupon-list',
	templateUrl: './coupon-list.component.html',
	styleUrls: ['./coupon-list.component.scss']
})
export class CouponListComponent implements OnInit, OnDestroy {

	public searchForm: FormGroup;
	public isAuthLoading = false;
	public submitted = false;

	public isIdProvidedFlag = false;
	public couponId;

	public coupons;
	public txtSearch;

	private couponSubscription: Subscription;

	constructor(
		private activatedRoute: ActivatedRoute,
		private toastr: ToastrService,
		private appService: AppService,
		private constantService: ConstantService,
		private router: Router,
		private couponService: CouponService,
		private ngxSpinnerService: NgxSpinnerService
	) { }

  	ngOnInit(): void {
		
		try {
			this.activatedRoute.params.subscribe( async (params) => {

				this.searchForm = new FormGroup({
					searchTxt: new FormControl(null, Validators.required)
				});
		
				this.getAllCoupons(this.txtSearch);
			});
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	getAllCoupons(txtSearch) {
		try {

			this.ngxSpinnerService.show();
			this.couponSubscription = this.couponService.getAll(this.txtSearch).subscribe(
				(result) => {
					if (result.success) {
						// this.toastr.success( result.message, 'Success!');
						// this.router.navigate(['/coupons/list']);
						this.coupons = result.data.coupon;
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

	softDelete(couponId) {

		try {
			Swal.fire({
				title: 'Are you sure?',
				icon: 'question',
				iconHtml: '?',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				showCancelButton: true,
				showCloseButton: true,
			}).then((result) => {
				if (result.value) {
					this.deleteCouponById(couponId);
				}
			});
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	deleteCouponById(couponId) {
		try {

			this.ngxSpinnerService.show();
			this.couponSubscription = this.couponService.deleteById(couponId).subscribe(
				(result) => {
					if (result.success) {
						this.getAllCoupons(this.txtSearch);
						Swal.fire(
							'Deleted!',
							'Coupon has been deleted succesfully.',
							'success'
						);
					} else {
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

	confirmBlockUnblockCoupon(couponId, title, in_status) {
		try {

			let statusTxt = in_status ? 'BLOCK' : 'UNBLOCK';
			let status = in_status ? 'CLOSE' : 'OPEN';

			Swal.fire({
				title: 'Are you sure?',
				icon: 'question',
				iconHtml: '?',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				showCancelButton: true,
				showCloseButton: true,
			}).then((result) => {
				if (result.value) {
					this.blockUnblockCoupon(couponId, title, status);
				}
			});
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	blockUnblockCoupon(couponId, title, in_status) {
		try {

			let in_data = {
				title: title,
				status: in_status
			};
			this.ngxSpinnerService.show();

			this.couponSubscription = this.couponService.blockUnblock(couponId, in_data).subscribe(
				(result) => {
					// this.spinner.hide();
					if (result.success) {
						this.getAllCoupons(this.txtSearch);
						Swal.fire({
							icon: 'success',
							title: `Category ${in_status}`,
							text: result.msg.toString(),
						});
					} else {
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

	searchCoupon(txtSearch) {

		try {

			this.txtSearch = txtSearch;
			console.log('txtSearch', txtSearch);
			this.getAllCoupons(txtSearch);
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	public ngOnDestroy(): void {

        if (this.couponSubscription) {
            this.couponSubscription.unsubscribe();
        }
    }
}
