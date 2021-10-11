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
import { SiteSettingsService } from "../../../services/site-settings.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-site-settings-master',
	templateUrl: './site-settings-master.component.html',
	styleUrls: ['./site-settings-master.component.scss']
})
export class SiteSettingsMasterComponent implements OnInit, OnDestroy {

	SiteSettingsForm: FormGroup;
	submitted = false;

	isSiteSettingsIdProvidedFlag = false;
	siteSettingsKey;
	SiteSettingsData;

	private siteSettingsSubscription: Subscription;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private formBuilder: FormBuilder,
		private siteSettingsService: SiteSettingsService,
		private constantService: ConstantService,
		private ngxSpinnerService: NgxSpinnerService
	) { }

	ngOnInit(): void {

		this.setSiteSettingsKey();
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.SiteSettingsForm.controls;
	}

	setSiteSettingsKey() {
		try {
			this.activatedRoute.params.subscribe((params) => {
				this.siteSettingsKey = params.id;
				this.isSiteSettingsIdProvidedFlag = this.siteSettingsKey ? true : false;

				if (this.isSiteSettingsIdProvidedFlag) {
					this.getSiteSettingsByKey();

					this.SiteSettingsForm = this.formBuilder.group({
						site_setting_key: ['', [Validators.required]],
						value: ['', [Validators.required]],
						status: ['', [Validators.required]],
					});
				} else {
					this.SiteSettingsForm = this.formBuilder.group({
						site_setting_key: ['', [Validators.required]],
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

	getSiteSettingsByKey() {

		try {

			this.ngxSpinnerService.show();
			this.siteSettingsSubscription = this.siteSettingsService.getSiteSettingsByKey(this.siteSettingsKey).subscribe(
				(result) => {
					if (result.success) {
						this.SiteSettingsData = result.data.site_setting;
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

			this.SiteSettingsForm.patchValue({
				site_setting_key: this.SiteSettingsData.site_setting_key,
				value: this.SiteSettingsData.value,
				status: this.SiteSettingsData.status,
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
			if (this.SiteSettingsForm.invalid) {
				return;
			}

			let in_data = this.SiteSettingsForm.value;

			if (this.isSiteSettingsIdProvidedFlag) {
				this.updateSiteSettingsByKey(in_data);
			} else {

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

	updateSiteSettingsByKey(in_data) {

		try {

			this.ngxSpinnerService.show();
			let data = this.SiteSettingsForm.value;

			this.siteSettingsSubscription = this.siteSettingsService.updateSiteSettingsByKey(data, data.site_setting_key).subscribe(
				(result) => {
					console.log(result);

					if (result.success) {
						this.toastr.success(result.message, 'Success!');
						this.router.navigate(['/admin/site-settings/list']);
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

	public ngOnDestroy(): void {

        if (this.siteSettingsSubscription) {
            this.siteSettingsSubscription.unsubscribe();
        }
    }
}
