import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-product-master',
	templateUrl: './product-master.component.html',
	styleUrls: ['./product-master.component.scss']
})
export class ProductMasterComponent implements OnInit, OnDestroy {

	inputsValidated = {
		title: true,
		slug: false
	};
	disableSubmitbtn = true;

	prodForm: FormGroup;
	submitted = false;

	fileData: File = null;
	allowedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
	isImageExistsFlag = false;
	imageUrl = '';
	imageName = '';
	isImageInvalid = false;

	isprodIdProvidedFlag = false;
	prodId;
	prodData;

	public productImageLink;

	private productSubscription: Subscription;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private formBuilder: FormBuilder,
		private productService: ProductService,
		private constantService: ConstantService,
		private ngxSpinnerService: NgxSpinnerService
	) {
		this.productImageLink = this.productService.productImageLink;
	}

	ngOnInit(): void {
		this.setProductId();

		this.prodForm.patchValue({
			department_id: '61015dc81c8ccf217c4d68f4',
			category_id: '61120f3d1d3f362f6c932a25',
		});
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.prodForm.controls;
	}

	isInputsValidated() {
		if( this.inputsValidated.title == true && this.inputsValidated.slug == true ) {
			this.disableSubmitbtn = false;
		} else {
			this.disableSubmitbtn = true;
		}
	}

	changeSlug( $e ) {
		console.log('change')
		let product_title = $e.target.value.toLowerCase();
		let product_slug = product_title.split(' ').join('-');
		this.prodForm.patchValue({
			product_title: product_title,
			product_slug: product_slug
		});
	}

	onBlurTitle( $e ) {
		let product_title = $e.target.value;
	}

	onBlurSlug( $e ) {
		try {

			let product_slug = $e.target.value;
			this.productSubscription = this.productService.isProductSlugExists( product_slug ).subscribe(
				(result: any) => {
					let exists = result.data.exists;
					if( exists ) {
						console.log('inside if');
						throw result.data.msg;
					} else {
						this.inputsValidated.slug = true;
						console.log('inside else');
						this.isInputsValidated();
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

	setProductId() {
		try {
			this.activatedRoute.params.subscribe((params) => {
				this.prodId = params.id;
				this.isprodIdProvidedFlag = this.prodId ? true : false;

				if (this.isprodIdProvidedFlag) {
					this.getProductById();

					this.prodForm = this.formBuilder.group({
						department_id: ['', [Validators.required]],
						category_id: ['', [Validators.required]],
						product_title: ['', [Validators.required]],
						product_slug: ['', [Validators.required]],
						status: ['', [Validators.required]],
						imageLink: []
					});
				} else {
					this.prodForm = this.formBuilder.group({
						department_id: ['', [Validators.required]],
						category_id: ['', [Validators.required]],
						product_title: ['', [Validators.required]],
						product_slug: ['', [Validators.required]],
						status: ['', [Validators.required]],
						imageLink: []
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

	getProductById() {

		try {

			this.ngxSpinnerService.show();
			this.productSubscription = this.productService.getProductById(this.prodId).subscribe(
				(result) => {
					if (result.success) {
						this.prodData = result.data.product;
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
				department_id: this.prodData.department_id,
				category_id: this.prodData.category_id,
				product_title: this.prodData.product_title,
				product_slug: this.prodData.product_slug,
				status: this.prodData.status
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
			if (this.prodForm.invalid) {
				this.toastr.error(
					'Required fields must not kept empty and agreed to our terms!',
					'Validation Error!'
				);
				return;
			}

			let in_data = this.prodForm.value;
			in_data.product_title = in_data.product_title.toLowerCase();
			in_data.product_slug = in_data.product_slug.toLowerCase();

			if (this.isprodIdProvidedFlag) {
				this.updateProduct(in_data);
			} else {
				this.insertProduct(in_data);
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

	insertProduct(in_data) {
		try {

			console.log('insertUser');
			this.ngxSpinnerService.show();
			this.productSubscription = this.productService.insertProduct(in_data).subscribe(
				(result) => {
					console.log('result', result);

					// this.spinner.hide();

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate(['/admin/products/list']);
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

	updateProduct(in_data) {

		try {

			this.ngxSpinnerService.show();
			let data = this.prodForm.value;

			data.id = this.prodId;
			delete data.imageLink;

			if (!data.password) {
				delete data.password;
			}

			this.productSubscription = this.productService.updateProduct(data, this.prodId).subscribe(
				(result) => {
					console.log(result);

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate(['/admin/products/list']);
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

	onChange(event: any) {
		try {
			// console.log('inside');
			// console.log('event.target.files[0]', event.target.files[0]);
			this.fileData = <File>event.target.files[0];
			// console.log('this.fileData', this.fileData);
			// console.log('this.allowedFormats.indexOf( this.fileData.type )', this.allowedFormats.indexOf( this.fileData.type ));
			if (this.allowedFormats.indexOf(this.fileData.type) == -1) {
				this.setInvalidImageErr(true);
				return;
			}

			this.setInvalidImageErr(false);

			if (this.isprodIdProvidedFlag) {
				this.modifyUserProfilePic();
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

	setInvalidImageErr(flag) {
		try {
			if (flag) {
				this.fileData = null;
				this.isImageInvalid = true;
				// this.enableSubmitButton = false;

				Swal.fire('info', 'Only PNG/JPEG/JPG files allowed!');
			} else {
				this.isImageInvalid = false;
				// this.enableSubmitButton = true;
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

	modifyUserProfilePic() {
		try {
			// this.spinner.show();

			if (this.allowedFormats.indexOf(this.fileData.type) == -1) {
				// this.fileData = null;
				// alert('Only PNG/JPEG/JPG files allowed!');
				this.setInvalidImageErr(true);
				// this.spinner.hide();
				return;
			}

			this.setInvalidImageErr(false);

			this.ngxSpinnerService.show();
			this.productSubscription = this.productService.modifyProductProfilePic(this.prodId, this.fileData).subscribe(
				(result) => {
					console.log(result);

					if (result.success) {

						this.isImageExistsFlag = true;
						// this.imageName = this.prodData.profilePic;
						// this.imageUrl = this.productImageLink + result.data.user.profilePic;
						Swal.fire(
							'Profile Pic Updated!',
							'Product has been updated succesfully.',
							'success'
						);
					} else {
						Swal.fire(
							'Error!',
							'An error occured while upload.',
							'error'
						);
					}
				},
				(error) => {

					this.ngxSpinnerService.hide();
					console.log('error');
					console.log(error);
					Swal.fire('error', error, error);
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

	deleteImage( in_imageUrl ) {

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
					this.deleteUserImage(in_imageUrl);
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

	deleteUserImage( in_imageName ) {

		try {

			this.ngxSpinnerService.show();
			this.productSubscription = this.productService.deleteImageByProductId(in_imageName, this.prodId).subscribe(
				(result) => {
					if (result.success) {
						this.isImageExistsFlag = false;
						this.imageName = '';
						this.imageUrl = this.productImageLink + result.data.user.profilePic;
						Swal.fire(
							'Deleted!',
							'Product profile pic has been deleted succesfully.',
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

	goToLink( in_imageUrl ) {
		window.open( in_imageUrl, "_blank");
	}

	public ngOnDestroy(): void {

        if (this.productSubscription) {
            this.productSubscription.unsubscribe();
        }
    }
}
