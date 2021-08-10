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
import { CategoryService } from '../../../services/category.service';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.scss']
})
export class CategoryMasterComponent implements OnInit {

  catgForm: FormGroup;
	submitted = false;

	isDeptIdProvidedFlag = false;
	deptId;

  isCatgIdProvidedFlag = false;
	catgId;
	catgData;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private formBuilder: FormBuilder,
		private categoryService: CategoryService,
		private constantService: ConstantService,
		private ngxSpinnerService: NgxSpinnerService
	) {}

  ngOnInit(): void {
		this.setDeptId();
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.catgForm.controls;
	}

	setDeptId() {
		try {

			this.catgForm = this.formBuilder.group({
				title: ['', [Validators.required]],
				status: ['', [Validators.required]]
			});

			this.activatedRoute.params.subscribe( async (params) => {
				this.deptId = params.departmentId;
				this.catgId = params.id;

        this.isDeptIdProvidedFlag = this.deptId ? true : false;
				this.isCatgIdProvidedFlag = this.catgId ? true : false;

        if (this.isDeptIdProvidedFlag) {

          await this.categoryService.setCatgApiEndPoint( this.deptId );
        } else {
          let obj = {
						resCode: 400,
						msg: 'Department ID is missing.',
					};
					this.constantService.handleResCode(obj);
        }

				if( this.isCatgIdProvidedFlag ) {
					this.getCatgById();
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

	getCatgById() {

		try {

			this.ngxSpinnerService.show();
			this.categoryService.getCategoryById(this.catgId).subscribe(
				(result) => {
					if (result.success) {
						this.catgData = result.data.category;
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

			this.catgForm.patchValue({
				title: this.catgData.title,
				status: this.catgData.status
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
			if (this.catgForm.invalid) {
				return;
			}

			let in_data = this.catgForm.value;

			if (this.isCatgIdProvidedFlag) {
				this.updateCategory(in_data);
			} else {
				this.insertCategory(in_data);
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

	insertCategory(in_data) {
		try {

			console.log('insertCategory');
			this.ngxSpinnerService.show();
			this.categoryService.insertCategory(in_data).subscribe(
				(result) => {
					console.log('result', result);

					// this.spinner.hide();

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate([`/admin/departments/${this.deptId}/categories/list`]);
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

	updateCategory(in_data) {

		try {

			this.ngxSpinnerService.show();
			let data = this.catgForm.value;

			data.id = this.catgId;
			delete data.imageLink;

			if (!data.password) {
				delete data.password;
			}

			this.categoryService.updateCategory(data, this.catgId).subscribe(
				(result) => {
					console.log(result);

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate([`/admin/departments/${this.deptId}/categories/list`]);
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
