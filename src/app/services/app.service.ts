import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Gatekeeper} from 'gatekeeper-client-sdk';

import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;

    constructor(
        private router: Router, 
        private toastr: ToastrService,
        private userService: UserService
    ) {}

    async loginByAuth({email, password}) {
        try {
            const token = await Gatekeeper.loginByAuth(email, password);
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async registerByAuth({email, password}) {
        try {
            const token = await Gatekeeper.registerByAuth(email, password);
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async loginByGoogle() {
        try {
            const token = await Gatekeeper.loginByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async registerByGoogle() {
        try {
            const token = await Gatekeeper.registerByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async loginByFacebook() {
        try {
            const token = await Gatekeeper.loginByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async registerByFacebook() {
        try {
            const token = await Gatekeeper.registerByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async getProfile() {
        try {
            // this.user = await Gatekeeper.getProfile();

            // this.user = await Gatekeeper.getProfile();
            let user = JSON.parse(localStorage.getItem('currentUser'));
            this.user = this.userService.getUserById( user._id );
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('gatekeeper_token');
        localStorage.clear();
        this.user = null;
        this.router.navigate(['/login']);
    }
}
