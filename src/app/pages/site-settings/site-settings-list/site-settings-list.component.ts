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
import { SiteSettingsService } from "../../../services/site-settings.service";

import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-site-settings-list',
	templateUrl: './site-settings-list.component.html',
	styleUrls: ['./site-settings-list.component.scss']
})
export class SiteSettingsListComponent implements OnInit, OnDestroy {

	public usrSearchForm: FormGroup;
	public isAuthLoading = false;
	public submitted = false;

	public siteSettings;
	public txtSearch;

	private siteSettingsSubscription: Subscription;

	constructor(
		private toastr: ToastrService,
		private appService: AppService,
		private constantService: ConstantService,
		private siteSettingsService: SiteSettingsService,
		private router: Router,
		private ngxSpinnerService: NgxSpinnerService
	) { }

	ngOnInit(): void {

		this.usrSearchForm = new FormGroup({
			searchTxt: new FormControl(null, Validators.required)
		});

		this.getAllSiteSettings(this.txtSearch);
	}

	getAllSiteSettings(txtSearch) {
		try {

			this.ngxSpinnerService.show();
			this.siteSettingsSubscription = this.siteSettingsService.getAllSiteSettings(this.txtSearch).subscribe(
				(result) => {
					if (result.success) {
						// this.toastr.success( result.message, 'Success!');
						// this.router.navigate(['/siteSettings/list']);
						this.siteSettings = result.data.site_settings;
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

	searchUser(txtSearch) {

		try {

			this.txtSearch = txtSearch;
			console.log('txtSearch', txtSearch);
			this.getAllSiteSettings(txtSearch);
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
		return item.value;
	}

	public ngOnDestroy(): void {

        if (this.siteSettingsSubscription) {
            this.siteSettingsSubscription.unsubscribe();
        }
    }
}
