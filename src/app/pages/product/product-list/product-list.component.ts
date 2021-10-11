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
import { ProductService } from "../../../services/product.service";

import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {

	public prodSearchForm: FormGroup;
	public isAuthLoading = false;
	public submitted = false;

	public products;
	public txtSearch;

	private productSubscription: Subscription;

	constructor(
		private toastr: ToastrService,
		private appService: AppService,
		private constantService: ConstantService,
		private productService: ProductService,
		private router: Router,
		private ngxSpinnerService: NgxSpinnerService
	) { }

	ngOnInit(): void {
		
		this.prodSearchForm = new FormGroup({
			searchTxt: new FormControl(null, Validators.required)
		});

		this.getAllproducts(this.txtSearch);
	}

	getAllproducts(txtSearch) {
		try {

			this.ngxSpinnerService.show();
			this.productSubscription = this.productService.getAllProducts(this.txtSearch).subscribe(
				(result) => {
					if (result.success) {
						// this.toastr.success( result.message, 'Success!');
						// this.router.navigate(['/products/list']);
						this.products = result.data.product;
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

	softDelete(prodId) {

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
					this.deleteProductByProductId(prodId);
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

	deleteProductByProductId(prodId) {
		try {

			this.ngxSpinnerService.show();
			this.productSubscription = this.productService.deleteProductByProductId(prodId).subscribe(
				(result) => {
					if (result.success) {
						this.getAllproducts(this.txtSearch);
						Swal.fire(
							'Deleted!',
							'Product has been deleted succesfully.',
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

	confirmBlockUnblockProduct(prodId, in_status) {
		try {
			let statusTxt = in_status ? 'CLOSE' : 'OPEN';
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
					this.blockUnblockProduct(prodId, status);
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

	blockUnblockProduct(prodId, in_status) {
		try {
			let statusTxt = in_status == 'OPEN' ? 'OPEN' : 'CLOSE';

			let in_data = {
				status: statusTxt,
			};
			this.ngxSpinnerService.show();

			this.productSubscription = this.productService.blockUnblockProduct(prodId, in_data).subscribe(
				(result) => {
					// this.spinner.hide();
					if (result.success) {
						this.getAllproducts(this.txtSearch);
						Swal.fire({
							icon: 'success',
							title: `Product status set to ${statusTxt}`,
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

	searchProduct(txtSearch) {
		try {

			this.txtSearch = txtSearch;
			console.log('txtSearch', txtSearch);
			// this.getAllproducts(txtSearch);
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
		return item.product_title;
	}

	public ngOnDestroy(): void {

        if (this.productSubscription) {
            this.productSubscription.unsubscribe();
        }
    }
}
