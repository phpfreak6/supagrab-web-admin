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
import { CmsService } from "../../../services/cms.service";

import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cms-list',
  templateUrl: './cms-list.component.html',
  styleUrls: ['./cms-list.component.scss']
})
export class CmsListComponent implements OnInit, OnDestroy {

  	public cmsSearchForm: FormGroup;
	public isAuthLoading = false;
	public submitted = false;

	public cms;
	public txtSearch;

	private cmsSubscription: Subscription;

	constructor(
		private toastr: ToastrService,
		private appService: AppService,
		private constantService: ConstantService,
		private cmsService: CmsService,
		private router: Router,
		private ngxSpinnerService: NgxSpinnerService
	) { }

	ngOnInit(): void {
		this.cmsSearchForm = new FormGroup({
			searchTxt: new FormControl(null, Validators.required)
		});

		this.getAllCms( this.txtSearch );
	}

	getAllCms(txtSearch) {
		try {

			this.ngxSpinnerService.show();
			this.cmsSubscription = this.cmsService.getAllCms(this.txtSearch).subscribe(
				(result) => {
					if (result.success) {
						// this.toastr.success( result.message, 'Success!');
						// this.router.navigate(['/users/list']);
						this.cms = result.data.cms;
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

	softDelete(cmsId) {
console.log('cmsId', cmsId);
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
					this.deleteCmsByCmsId(cmsId);
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

	deleteCmsByCmsId(cmsId) {
		try {

			this.ngxSpinnerService.show();
			this.cmsSubscription = this.cmsService.deleteCmsByCmsId(cmsId).subscribe(
				(result) => {
					if (result.success) {
						this.getAllCms(this.txtSearch);
						Swal.fire(
							'Deleted!',
							'Cms has been deleted succesfully.',
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

	confirmBlockUnblockCms(cmsId, in_status) {
		try {
			console.log('in_status', in_status);
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
					this.blockUnblockCms(cmsId, status);
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

	blockUnblockCms(cmsId, in_status) {
		try {
			let statusTxt = in_status == 'BLOCKED' ? 'BLOCKED' : 'ACTIVE';

			let in_data = {
				status: in_status,
			};
			this.ngxSpinnerService.show();

			this.cmsSubscription = this.cmsService.blockUnblockCms(cmsId, in_data).subscribe(
				(result) => {
					// this.spinner.hide();
					if (result.success) {
						this.getAllCms(this.txtSearch);
						Swal.fire({
							icon: 'success',
							title: `User ${in_status}`,
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

	searchCms(txtSearch) {

		try {

			this.txtSearch = txtSearch;
			console.log('txtSearch', txtSearch);
			this.getAllCms(txtSearch);
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	public ngOnDestroy(): void {

        if (this.cmsSubscription) {
            this.cmsSubscription.unsubscribe();
        }
    }
}
