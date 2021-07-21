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
import { CmsService } from '../../../services/cms.service';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-cms-master',
  templateUrl: './cms-master.component.html',
  styleUrls: ['./cms-master.component.scss']
})
export class CmsMasterComponent implements OnInit {

  faqForm: FormGroup;
	submitted = false;

	isFaqIdProvidedFlag = false;
	faqId;
	cmsData;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private formBuilder: FormBuilder,
		private cmsService: CmsService,
		private constantService: ConstantService,
		private ngxSpinnerService: NgxSpinnerService
	) { }

	ngOnInit(): void {

		this.setFaqId();
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.faqForm.controls;
	}

	setFaqId() {
		try {
			this.activatedRoute.params.subscribe((params) => {
				this.faqId = params.id;
				this.isFaqIdProvidedFlag = this.faqId ? true : false;

				if (this.isFaqIdProvidedFlag) {
					this.getCmsById();

					this.faqForm = this.formBuilder.group({
						key: ['', [Validators.required]],
						value: ['', [Validators.required]],
						status: ['', [Validators.required]],
					});
				} else {
					this.faqForm = this.formBuilder.group({
						key: ['', [Validators.required]],
						value: ['', [Validators.required]],
						status: ['', [Validators.required]],
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

	getCmsById() {

		try {

			this.ngxSpinnerService.show();
			this.cmsService.getCmsById(this.faqId).subscribe(
				(result) => {
					if (result.success) {
						this.cmsData = result.data.cms;
						this.setFormData();
					} else {
						Swal.fire('User not found!', 'Status 404.', 'success');
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

			this.faqForm.patchValue({
				key: this.cmsData.key,
				value: this.cmsData.value,
				status: this.cmsData.status,
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
			if (this.faqForm.invalid) {
				return;
			}

			let in_data = this.faqForm.value;

			if (this.isFaqIdProvidedFlag) {
				this.updateCms(in_data);
			} else {
				this.insertCms(in_data);
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

	insertCms(in_data) {
		try {

			this.ngxSpinnerService.show();
			this.cmsService.insertCms(in_data).subscribe(
				(result) => {
					console.log('result', result);

					// this.spinner.hide();

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate(['/admin/cms/list']);
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

	updateCms(in_data) {

		try {

			this.ngxSpinnerService.show();
			let data = this.faqForm.value;

			data.id = this.faqId;
			this.cmsService.updateCms(data, this.faqId).subscribe(
				(result) => {
					console.log(result);

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate(['/admin/cms/list']);
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
