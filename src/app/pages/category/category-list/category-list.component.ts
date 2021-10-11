import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	FormGroup,
	FormControl,
	Validators,
	FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import Swal from 'sweetalert2';

import { ConstantService } from "../../../services/constant.service";
import { CategoryService } from "../../../services/category.service";

import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {

  	public catgSearchForm: FormGroup;
	public isAuthLoading = false;
	public submitted = false;

	public isDeptIdProvidedFlag = false;
	public deptId;

	public isCatgIdProvidedFlag = false;
	public catgs;
	public catgId;
	public txtSearch;

	private categorySubscription: Subscription;

	constructor(
		private activatedRoute: ActivatedRoute,
		private toastr: ToastrService,
		private appService: AppService,
		private constantService: ConstantService,
		private categoryService: CategoryService,
		private router: Router,
		private ngxSpinnerService: NgxSpinnerService
	) { }

  	ngOnInit(): void {
		
		try {
			this.activatedRoute.params.subscribe( async (params) => {
				this.deptId = params.departmentId;
				this.isDeptIdProvidedFlag = this.deptId ? true : false;

				if( this.isDeptIdProvidedFlag ) {
					await this.categoryService.setCatgApiEndPoint( this.deptId );
					this.catgSearchForm = new FormGroup({
						searchTxt: new FormControl(null, Validators.required)
					});
			
					this.getAllCategories(this.txtSearch);
				} else {
					let obj = {
						resCode: 400,
						msg: 'Department ID is missing.',
					};
					this.constantService.handleResCode(obj);
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

	getAllCategories(txtSearch) {
		try {

			this.ngxSpinnerService.show();
			this.categorySubscription = this.categoryService.getAllCategories(this.txtSearch).subscribe(
				(result) => {
					if (result.success) {
						// this.toastr.success( result.message, 'Success!');
						// this.router.navigate(['/catgs/list']);
						this.catgs = result.data.categories;
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

	softDelete(catgId) {

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
					this.deleteCategoryBycatgId(catgId);
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

	deleteCategoryBycatgId(catgId) {
		try {

			this.ngxSpinnerService.show();
			this.categorySubscription = this.categoryService.deleteCategoryByCategoryId(catgId).subscribe(
				(result) => {
					if (result.success) {
						this.getAllCategories(this.txtSearch);
						Swal.fire(
							'Deleted!',
							'Category has been deleted succesfully.',
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

	confirmBlockUnblockCategory(catgId, title, in_status) {
		try {

			let statusTxt = in_status ? 'BLOCK' : 'UNBLOCK';
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
					this.blockUnblockCategory(catgId, title, status);
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

	blockUnblockCategory(catgId, title, in_status) {
		try {

			let in_data = {
				title: title,
				status: in_status
			};
			this.ngxSpinnerService.show();

			this.categorySubscription = this.categoryService.blockUnblockCategory(catgId, in_data).subscribe(
				(result) => {
					// this.spinner.hide();
					if (result.success) {
						this.getAllCategories(this.txtSearch);
						Swal.fire({
							icon: 'success',
							title: `Category ${in_status}`,
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

	searchCategory(txtSearch) {

		try {

			this.txtSearch = txtSearch;
			console.log('txtSearch', txtSearch);
			this.getAllCategories(txtSearch);
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
		return item.category_title;
	}

	public ngOnDestroy(): void {
		
		if( this.categorySubscription ) {
			this.categorySubscription.unsubscribe();
		}
	}
}
