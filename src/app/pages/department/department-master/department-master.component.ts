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
import { DepartmentService } from '../../../services/department.service';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-department-master',
    templateUrl: './department-master.component.html',
    styleUrls: ['./department-master.component.scss']
})
export class DepartmentMasterComponent implements OnInit {

    deptForm: FormGroup;
	submitted = false;
	disableSubmitbtn = true;

	inputsValidated = {
		title: true,
		slug: false
	};

	isDeptIdProvidedFlag = false;
	deptId;
	deptData;

	public deptImageLink;
	fileData: File = null;
	allowedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
	isImageExistsFlag = false;
	imageUrl = '';
	imageName = '';
	isImageInvalid = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private formBuilder: FormBuilder,
		private departmentService: DepartmentService,
		private constantService: ConstantService,
		private ngxSpinnerService: NgxSpinnerService
	) {
		this.deptImageLink = this.departmentService.departmentImageLink;
	}

	ngOnInit(): void {
		this.setDeptId();
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.deptForm.controls;
	}

	setDeptId() {
		try {
			this.activatedRoute.params.subscribe((params) => {
				this.deptId = params.id;
				this.isDeptIdProvidedFlag = this.deptId ? true : false;

				if (this.isDeptIdProvidedFlag) {
					this.getDeptById();

					this.inputsValidated.slug = true;
					this.isInputsValidated();
					this.deptForm = this.formBuilder.group({
						department_title: ['', [Validators.required]],
						department_slug: ['', [Validators.required]],
						status: ['', [Validators.required]],
						imageLink: []
					});
				} else {
					this.deptForm = this.formBuilder.group({
						department_title: ['', [Validators.required]],
						department_slug: ['', [Validators.required]],
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

	getDeptById() {

		try {

			this.ngxSpinnerService.show();
			this.departmentService.getDepartmentById(this.deptId).subscribe(
				(result) => {
					if (result.success) {
						this.deptData = result.data.department;
						this.imageName = result.data.department.image;
						this.imageUrl = this.deptImageLink +'/'+ result.data.department.image;
						this.setFormData();
					} else {
						Swal.fire('Department not found!', 'Status 404.', 'success');
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

	isInputsValidated() {
		if( this.inputsValidated.title == true && this.inputsValidated.slug == true ) {
			this.disableSubmitbtn = false;
		} else {
			this.disableSubmitbtn = true;
		}
	}

	changeSlug( $e ) {
		let department_title = $e.target.value;
		let department_slug = department_title.split(' ').join('-');
		this.deptForm.patchValue({
			department_slug: department_slug
		});
	}

	onBlurTitle( $e ) {
		let department_title = $e.target.value;
	}

	onBlurSlug( $e ) {
		try {

			let department_slug = $e.target.value;
			this.departmentService.isDepartmentSlugExists( department_slug ).subscribe(
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

	setFormData() {

		try {

			this.deptForm.patchValue({
				department_title: this.deptData.department_title,
				department_slug: this.deptData.department_slug,
				status: this.deptData.status
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
			if (this.deptForm.invalid) {
				return;
			}

			let in_data = this.deptForm.value;

			if (this.isDeptIdProvidedFlag) {
				this.updateDepartment(in_data);
			} else {
				this.insertDepartment(in_data);
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

	insertDepartment(in_data) {
		try {

			console.log('insertDepartment');
			this.ngxSpinnerService.show();
			this.departmentService.insertDepartment(in_data).subscribe(
				(result) => {
					console.log('result', result);

					// this.spinner.hide();

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate(['/admin/departments/list']);
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

	updateDepartment(in_data) {

		try {

			this.ngxSpinnerService.show();
			let data = this.deptForm.value;

			data.id = this.deptId;
			delete data.imageLink;

			this.departmentService.updateDepartment(data, this.deptId).subscribe(
				(result) => {
					console.log(result);

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate(['/admin/departments/list']);
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

			if (this.isDeptIdProvidedFlag) {
				this.modifyDepartmentProfilePic();
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

	modifyDepartmentProfilePic() {
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
			this.departmentService.modifyDepartmentProfilePic(this.deptId, this.fileData).subscribe(
				(result) => {
					console.log(result);

					if (result.success) {

						this.isImageExistsFlag = true;
						this.imageName = result.data.department.image;
						// this.deptImageLink = result.data.department_image_path;
						this.imageUrl = this.deptImageLink +'/'+ result.data.department.image;
						Swal.fire(
							'Department image Updated!',
							'Department has been updated succesfully.',
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
					this.deleteDeptImage(in_imageUrl);
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

	deleteDeptImage( in_imageName ) {

		try {

			this.ngxSpinnerService.show();
			this.departmentService.deleteImageByDepartmentId(in_imageName, this.deptId).subscribe(
				(result) => {
					if (result.success) {
						this.isImageExistsFlag = false;
						this.imageName = '';
						this.imageUrl = this.deptImageLink + result.data.department.image;
						Swal.fire(
							'Deleted!',
							'Department image has been deleted succesfully.',
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
}


