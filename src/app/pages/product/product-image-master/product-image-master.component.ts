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
	selector: 'app-product-image-master',
	templateUrl: './product-image-master.component.html',
	styleUrls: ['./product-image-master.component.scss']
})
export class ProductImageMasterComponent implements OnInit {

	prodImgForm: FormGroup;
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
	prodDataImg;
	prodDataImgFlag = false;

	public productImageLink;

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
		this.prodImgForm = this.formBuilder.group({
			imageLink: []
		});
		this.setProductId();
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.prodImgForm.controls;
	}

	setProductId() {
		try {
			this.activatedRoute.params.subscribe((params) => {
				this.prodId = params.id;
				this.isprodIdProvidedFlag = this.prodId ? true : false;
				this.getProductById();
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
			this.productService.getProductById(this.prodId).subscribe(
				(result) => {
					if (result.success) {
						this.prodData = result.data.product;
						this.prodDataImg = this.prodData.images;
						console.log('this.prodData',this.prodData);
						console.log('this.prodDataImg',this.prodDataImg);
						this.prodDataImgFlag = true;
						this.productImageLink = result.data.PRODUCT_IMAGE_PATH;
						console.log('this.productImageLink', this.productImageLink);
						// this.imageName = this.prodData.profilePic;
						// this.productImageLink = result.data.userImagePath + '/';
						// this.setFormData();
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

	onSubmit() {}

	onChange(event: any) {
		try {
			// console.log('inside');
			// console.log('event.target.files[0]', event.target.files[0]);
			this.fileData = <File>event.target.files[0];
			console.log('fileData', this.fileData);
			// this.fileData = <File>event.target.files;
			// console.log('this.allowedFormats.indexOf( this.fileData.type )', this.allowedFormats.indexOf( this.fileData.type ));
			if (this.allowedFormats.indexOf(this.fileData.type) == -1) {
				this.setInvalidImageErr(true);
				return;
			}

			this.setInvalidImageErr(false);

			if (this.isprodIdProvidedFlag) {
				this.uploadImages();
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

	uploadImages() {
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
			this.productService.uploadImages(this.prodId, this.fileData).subscribe(
				(result: any) => {
					console.log(result);

					if (result.success) {

						this.isImageExistsFlag = true;
						// this.imageName = this.prodData.profilePic;
						// this.imageUrl = this.productImageLink + result.data.user.profilePic;
						this.setProductId();
						this.prodImgForm.reset();
						Swal.fire(
							'Upload Successfull!',
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
			this.productService.deleteImageByProductId(in_imageName, this.prodId).subscribe(
				(result) => {
					if (result.success) {
						this.isImageExistsFlag = false;
						this.imageName = '';
						// this.imageUrl = this.productImageLink + result.data.user.profilePic;
						Swal.fire(
							'Deleted!',
							'Product image has been deleted succesfully.',
							'success'
						);
						this.setProductId();
						this.prodImgForm.reset();
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

	setPrimary( in_primary, image_id ) {
		
		if( !in_primary ) {
			let setPrimary = !in_primary;
			console.log('image_id', image_id);

			this.ngxSpinnerService.show();
			this.productService.setPrimary( setPrimary, image_id, this.prodId ).subscribe(
				(result) => {
					if (result.success) {
						Swal.fire(
							'Marked as primary!',
							'Product image has been Marked as primary succesfully.',
							'success'
						);
						this.setProductId();
						this.prodImgForm.reset();
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
		}
	}
}

