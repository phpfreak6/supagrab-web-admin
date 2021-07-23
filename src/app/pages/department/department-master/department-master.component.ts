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

	isDeptIdProvidedFlag = false;
	deptId;
	deptData;

	public userImageLink;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private formBuilder: FormBuilder,
		private departmentService: DepartmentService,
		private constantService: ConstantService,
		private ngxSpinnerService: NgxSpinnerService
	) {}

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

					this.deptForm = this.formBuilder.group({
						title: ['', [Validators.required]],
						status: ['', [Validators.required]]
					});
				} else {
					this.deptForm = this.formBuilder.group({
						title: ['', [Validators.required]],
						status: ['', [Validators.required]]
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

	setFormData() {

		try {

			this.deptForm.patchValue({
				title: this.deptData.title,
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

			if (!data.password) {
				delete data.password;
			}

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
}
