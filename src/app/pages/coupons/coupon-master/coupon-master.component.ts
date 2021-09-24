import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormControl,
	Validators,
	FormBuilder,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ConstantService } from '../../../services/constant.service';
import { CouponService } from '../../../services/coupon.service';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-coupon-master',
  templateUrl: './coupon-master.component.html',
  styleUrls: ['./coupon-master.component.scss']
})
export class CouponMasterComponent implements OnInit {

	couponForm: FormGroup;
	submitted = false;
	disableSubmitbtn = true;

	inputsValidated = {
		title: true,
		slug: false
	};

	isCatgIdProvidedFlag = false;
	couponId;
	couponData;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private formBuilder: FormBuilder,
		private couponService: CouponService,
		private constantService: ConstantService,
		private ngxSpinnerService: NgxSpinnerService
	) { }

	ngOnInit(): void {
		this.setCouponId();
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.couponForm.controls;
	}

	setCouponId() {
		try {

			this.couponForm = this.formBuilder.group({
				coupon_title: ['', [Validators.required]],
				coupon_code: ['', [Validators.required]],
				coupon_description: ['', [Validators.required]],
				coupon_max_uses: ['', [Validators.required]],
				coupon_uses_yet: ['', [Validators.required]],
				coupon_type: ['', [Validators.required]],
				discount_amount: ['', [Validators.required]],
				opened_at: ['', [Validators.required]],
				expired_at: ['', [Validators.required]],
				status: ['', [Validators.required]]
			});

			this.activatedRoute.params.subscribe(async (params) => {
				this.couponId = params.id;

				this.isCatgIdProvidedFlag = this.couponId ? true : false;

				if (this.isCatgIdProvidedFlag) {
					this.getCouponById();
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

	getCouponById() {

		try {

			this.ngxSpinnerService.show();
			this.couponService.getById(this.couponId).subscribe(
				(result) => {
					if (result.success) {
						this.couponData = result.data.coupon;
						this.setFormData();
					} else {
						Swal.fire('Category not found!', 'Status 404.', 'success');
						this.constantService.handleResCode(result);
					}
				},
				(error) => {

					this.ngxSpinnerService.hide();
					console.log('error');
					console.log(error);

					let obj = {
						resCode: 400,
						msg: error.toString(),
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

	setFormData() {

		try {

			let opened_at = this.couponService.formatDate( this.couponData.opened_at );
			let expired_at = this.couponService.formatDate(this.couponData.expired_at);

			this.couponForm.patchValue({
				coupon_title: this.couponData.coupon_title,
				coupon_code: this.couponData.coupon_code,
				coupon_description: this.couponData.coupon_description,
				coupon_max_uses: this.couponData.coupon_max_uses,
				coupon_uses_yet: this.couponData.coupon_uses_yet,
				coupon_type: this.couponData.coupon_type,
				discount_amount: this.couponData.discount_amount,
				opened_at: opened_at,
				expired_at: expired_at,
				status: this.couponData.status,
			});
			// this.spinner.hide();
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	onSubmit() {
		try {
			this.submitted = true;
			// stop here if form is invalid
			if (this.couponForm.invalid) {
				return;
			}

			let in_data = this.couponForm.value;

			if (this.isCatgIdProvidedFlag) {
				this.updateCoupon(in_data);
			} else {
				this.insertCoupon(in_data);
			}
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	insertCoupon(in_data) {
		try {

			console.log('insertCategory');
			this.ngxSpinnerService.show();
			this.couponService.insert(in_data).subscribe(
				(result) => {
					console.log('result', result);

					// this.spinner.hide();

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate([`/admin/coupons/list`]);
					} else {
						// this.toastr.error(result.errorArr[0], 'Request Error!');
						this.constantService.handleResCode(result);
					}
				},
				(error) => {

					this.ngxSpinnerService.hide();
					console.log('error');
					console.log(error);
					let obj = {
						resCode: 400,
						msg: error.message.toString(),
					};
					this.constantService.handleResCode(obj);
					// this.toastr.error(error.msg, 'Request Error!');
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

	updateCoupon(in_data) {

		try {

			this.ngxSpinnerService.show();
			let data = this.couponForm.value;

			data.id = this.couponId;
			delete data.imageLink;

			this.couponService.update(data, this.couponId).subscribe(
				(result) => {
					console.log(result);

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate([`/admin/coupons/list`]);
					} else {
						// this.toastr.error(result.errorArr[0], 'Request Error!');
						this.constantService.handleResCode(result);
					}
				},
				(error) => {

					this.ngxSpinnerService.hide();
					console.log('error');
					console.log(error);
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: error,
					});
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
}
