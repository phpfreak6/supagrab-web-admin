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
import { ProductService } from '../../../services/product.service';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: 'app-product-attributes-master',
	templateUrl: './product-attributes-master.component.html',
	styleUrls: ['./product-attributes-master.component.scss']
})
export class ProductAttributesMasterComponent implements OnInit {

	prodForm: FormGroup;
	submitted = false;

	isProdIdProvidedFlag = false;
	prodId;
	prodData;

	isAttrIdProvidedFlag = false;
	attrId;
	attrData;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private formBuilder: FormBuilder,
		private productService: ProductService,
		private constantService: ConstantService,
		private ngxSpinnerService: NgxSpinnerService
	) { }

	ngOnInit(): void {
		this.setAttrId();
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.prodForm.controls;
	}

	setAttrId() {
		try {
			this.activatedRoute.params.subscribe((params) => {
				this.prodId = params.productId;
				this.isProdIdProvidedFlag = this.prodId ? true : false;

				this.attrId = params.id;
				this.isAttrIdProvidedFlag = this.attrId ? true : false;

				if (this.isAttrIdProvidedFlag) {
					this.getAttrById();

					this.prodForm = this.formBuilder.group({
						tab_name: ['', [Validators.required]],
						tab_value: ['', [Validators.required]]
					});
				} else {
					this.prodForm = this.formBuilder.group({
						tab_name: ['', [Validators.required]],
						tab_value: ['', [Validators.required]]
					});
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

	getAttrById() {

		try {

			this.ngxSpinnerService.show();
			this.productService.getAttrById( this.prodId, this.attrId).subscribe(
				(result) => {
					if (result.success) {
						this.attrData = result?.data?.product[0]?.attributes;
						// this.imageName = this.prodData.profilePic;
						// this.productImageLink = result.data.userImagePath + '/';
						this.setFormData();
					} else {
						Swal.fire('Product not found!', 'Status 404.', 'success');
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
			this.prodForm.patchValue({
				tab_name: this.attrData.tab_name,
				tab_value: this.attrData.tab_value
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

	onSubmit() {
		try {
			this.submitted = true;
			// stop here if form is invalid
			if (this.prodForm.invalid) {
				this.toastr.error(
					'Required fields must not kept empty and agreed to our terms!',
					'Validation Error!'
				);
				return;
			}

			let in_data = this.prodForm.value;

			if (this.isAttrIdProvidedFlag) {
				this.updateProductAttribute(in_data);
			} else {
				this.insertProductAttribute(in_data);
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

	insertProductAttribute( in_data ) {
		try {

			this.ngxSpinnerService.show();
			this.productService.insertProductAttribute( this.prodId, in_data).subscribe(
				(result) => {
					console.log('result', result);

					// this.spinner.hide();

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate([`/admin/products/${this.prodId}/attributes/list`]);
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

	updateProductAttribute( in_data ) {
		try {

			this.ngxSpinnerService.show();

			this.productService.updateProductAttribute( this.prodId, this.attrId, in_data ).subscribe(
				(result) => {
					console.log(result);

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						// this.router.navigate(['/admin/products/list']);
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
