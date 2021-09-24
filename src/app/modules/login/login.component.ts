import { Router } from '@angular/router';
import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
// import {FormGroup, FormControl, Validators} from '@angular/forms';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import Swal from 'sweetalert2';

import { ConstantService } from "../../services/constant.service";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";

import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'login-box';
    public loginForm: FormGroup;
    public isAuthLoading = false;
    public isGoogleLoading = false;
    public isFacebookLoading = false;
    public submitted = false;

    constructor(
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService,
        private constantService: ConstantService,
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
		private ngxSpinnerService: NgxSpinnerService
    ) {}

    ngOnInit() {

        if (this.appService.user) {
            this.router.navigate(['/admin']);
        }

        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.loginForm = new FormGroup({
            email: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    async loginByAuth() {
        if (this.loginForm.valid) {
            this.isAuthLoading = true;
            await this.appService.loginByAuth(this.loginForm.value);
            this.isAuthLoading = false;
        } else {
            this.toastr.error('Form is not valid!');
        }
    }

    async loginByGoogle() {
        this.isGoogleLoading = true;
        await this.appService.loginByGoogle();
        this.isGoogleLoading = false;
    }

    async loginByFacebook() {
        this.isFacebookLoading = true;
        await this.appService.loginByFacebook();
        this.isFacebookLoading = false;
    }

    loginDefault() {

        try {

            this.ngxSpinnerService.show();
            this.submitted = true;

            // stop here if form is invalid
            if (this.loginForm.invalid) {
                return;
            }

            // this.isAuthLoading = true;
            let in_data = this.loginForm.value;

            this.authService.login(in_data).subscribe(
                async (result) => {
                    console.log('result', result);

                    if (result.success) {
                        localStorage.setItem(
                            'currentUser',
                            JSON.stringify({
                                token: result.data.token,
                                user: result.data.user,
                            })
                        );

                        this.constantService.setLocalStorage();
                        await this.appService.getProfile();
                        this.router.navigate(['/admin']);
                        this.toastr.success(result.message, 'Success!');
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

    setFormData() {
        try {
            this.loginForm.patchValue({
                email: 'bawa_d@ymail.com',
                password: '123456',
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

    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
