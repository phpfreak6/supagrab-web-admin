import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
	FormGroup,
	FormControl,
	Validators,
	FormBuilder,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import Swal from 'sweetalert2';

import { ConstantService } from "../../../services/constant.service";
import { ProductService } from "../../../services/product.service";

import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-product-attributes-list',
	templateUrl: './product-attributes-list.component.html',
	styleUrls: ['./product-attributes-list.component.scss']
})
export class ProductAttributesListComponent implements OnInit, OnDestroy {

	public prodSearchForm: FormGroup;
	public isAuthLoading = false;
	public submitted = false;

	isProdIdProvidedFlag = false;
	prodId;
	prodData;

	public products;
	public txtSearch;

	private productSubscription: Subscription;

	constructor(
		private activatedRoute: ActivatedRoute,
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

		this.activatedRoute.params.subscribe((params) => {

			this.prodId = params.productId;
			this.isProdIdProvidedFlag = this.prodId ? true : false;

			this.getAllProductAttributes(this.txtSearch);
		});
	}

	getAllProductAttributes(txtSearch) {
		try {

			this.ngxSpinnerService.show();
			this.productSubscription = this.productService.getAllProductAttributes( this.prodId, this.txtSearch).subscribe(
				(result) => {
					if (result.success && result?.data?.product[0]?.attributes ) {
						// this.toastr.success( result.message, 'Success!');
						// this.router.navigate(['/products/list']);
						this.products = result.data.product[0].attributes;
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

	softDelete(userId) {

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
					this.deleteProductByProductId(userId);
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

	deleteProductByProductId(userId) {
		try {

			this.ngxSpinnerService.show();
			this.productSubscription = this.productService.deleteProductByProductId(userId).subscribe(
				(result) => {
					if (result.success) {
						this.getAllProductAttributes(this.txtSearch);
						Swal.fire(
							'Deleted!',
							'User has been deleted succesfully.',
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

	confirmBlockUnblockProduct(userId, in_status) {
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
					this.blockUnblockProduct(userId, status);
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

	blockUnblockProduct(userId, in_status) {
		try {
			let statusTxt = in_status == 'OPEN' ? 'OPEN' : 'CLOSE';

			let in_data = {
				status: statusTxt,
			};
			this.ngxSpinnerService.show();

			this.productSubscription = this.productService.blockUnblockProduct(userId, in_data).subscribe(
				(result) => {
					// this.spinner.hide();
					if (result.success) {
						this.getAllProductAttributes(this.txtSearch);
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
			// this.getAllProductAttributes(txtSearch);
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
		return item.tab_name;
	}

	public ngOnDestroy(): void {

        if (this.productSubscription) {
            this.productSubscription.unsubscribe();
        }
    }
}
