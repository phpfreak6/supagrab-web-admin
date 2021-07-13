import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ConstantService } from './constant.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	public apiEndPoint: string;
	public data;

	constructor(
		private httpClient: HttpClient,
		private constantService: ConstantService
	) {
		this.apiEndPoint = this.constantService.apiBaseUrl;
	}

	login(in_data): Observable<any> {
	
		return this.httpClient
		  .post(
			`${this.apiEndPoint}/auth/signIn`,
			in_data
		  )
		  .pipe(
			map((e: Response) => e),
			catchError((e: Response) => throwError(e))
		);
	}

	forgotPassword(in_data): Observable<any> {

		let formData: FormData = new FormData();
		formData.append('email', in_data.email);
	
		return this.httpClient
		  .post(`${this.apiEndPoint}/forgotPassword`, formData)
		  .pipe(
			map((e: Response) => e),
			catchError((e: Response) => throwError(e))
		);
	}
	
	signup(in_data): Observable<any> {
		  
		let formData: FormData = new FormData();
		formData.append('email', in_data.email);
		formData.append('password', in_data.password);
		formData.append('contact', in_data.contact);
		formData.append('first_name', in_data.first_name);
		formData.append('last_name', in_data.last_name);
		formData.append('role', in_data.role);
	
		return this.httpClient.post(`${this.apiEndPoint}/signup`, formData).pipe(
		  map((e: Response) => e),
		  catchError((e: Response) => throwError(e))
		);
	}

	async isLoggedIn() {

		let user = JSON.parse(localStorage.getItem('currentUser'));
		if( user.token ) {
			return true;
		} else {
			return false;
		}
	}
}
