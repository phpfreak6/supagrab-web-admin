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
import { FaqService } from "../../../services/faq.service";

import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-faq-list',
	templateUrl: './faq-list.component.html',
	styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent implements OnInit, OnDestroy {

	public faqSearchForm: FormGroup;
	public isAuthLoading = false;
	public submitted = false;

	public faqs;
	public txtSearch;

	private faqSubscription: Subscription;

	constructor(
		private toastr: ToastrService,
		private appService: AppService,
		private constantService: ConstantService,
		private faqService: FaqService,
		private router: Router,
		private ngxSpinnerService: NgxSpinnerService
	) { }

	ngOnInit(): void {
		this.faqSearchForm = new FormGroup({
			searchTxt: new FormControl(null, Validators.required)
		});

		this.getAllFaqs( this.txtSearch );
	}

	getAllFaqs(txtSearch) {
		try {

			this.ngxSpinnerService.show();
			this.faqSubscription = this.faqService.getAllFaqs(this.txtSearch).subscribe(
				(result) => {
					if (result.success) {
						// this.toastr.success( result.message, 'Success!');
						// this.router.navigate(['/users/list']);
						this.faqs = result.data.faq;
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

	softDelete(faqId) {

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
					this.deleteFaqByfaqId(faqId);
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

	deleteFaqByfaqId(faqId) {
		try {

			this.ngxSpinnerService.show();
			this.faqSubscription = this.faqService.deleteFaqByFaqId(faqId).subscribe(
				(result) => {
					if (result.success) {
						this.getAllFaqs(this.txtSearch);
						Swal.fire(
							'Deleted!',
							'Faq has been deleted succesfully.',
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

	confirmBlockUnblockFaq(faqId, in_status) {
		try {
			console.log('in_status', in_status);
			let statusTxt = in_status ? 'CLOSE' : 'OPEN';
			let status = in_status ? 'OPEN' : 'CLOSE';

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
					this.blockUnblockFaq(faqId, status);
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

	blockUnblockFaq(faqId, in_status) {
		try {
			let statusTxt = in_status == 'BLOCKED' ? 'BLOCKED' : 'ACTIVE';

			let in_data = {
				status: in_status,
			};
			this.ngxSpinnerService.show();

			this.faqSubscription = this.faqService.blockUnblockFaq(faqId, in_data).subscribe(
				(result) => {
					// this.spinner.hide();
					if (result.success) {
						this.getAllFaqs(this.txtSearch);
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

	searchFaq(txtSearch) {

		try {

			this.txtSearch = txtSearch;
			console.log('txtSearch', txtSearch);
			this.getAllFaqs(txtSearch);
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
		return item.question;
	}

	public ngOnDestroy(): void {

        if (this.faqSubscription) {
            this.faqSubscription.unsubscribe();
        }
    }
}
