import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ConstantService } from './constant.service';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	public apiEndPoint: string;
	public data;
	public userImageLink;

	constructor(
		private httpClient: HttpClient,
		private constantService: ConstantService
	) {
		this.apiEndPoint = this.constantService.apiBaseUrl + '/users';
		this.userImageLink = this.constantService.userImageLink;
	}

	getUserById(userId): Observable<any> {
		let url = `${this.apiEndPoint}/${userId}`;
		return this.httpClient
			.get(url, this.constantService.getHttpJsonOptions())
			.pipe(
				map((e: Response) => e),
				catchError((e: Response) => throwError(e))
			);
	}

	getAllUsers(search): Observable<any> {
		try {
			let url = `${this.apiEndPoint}`;
			search != undefined ? (url = `${url}?searchTxt=${search}`) : '';
			console.log('url', url);
			return this.httpClient
				.get(url, this.constantService.getHttpJsonOptions())
				.pipe(
					map((e: Response) => e),
					catchError((e: Response) => throwError(e))
				);
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	insertUser(in_data): Observable<any> {
		try {
			return this.httpClient
				.post(
					`${this.apiEndPoint}`,
					in_data,
					this.constantService.getHttpJsonOptions()
				)
				.pipe(
					map((e: Response) => e),
					catchError((e: Response) => throwError(e))
				);
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	updateUser(in_data, userId): Observable<any> {
		try {
			return this.httpClient
				.patch(
					`${this.apiEndPoint}/${userId}`,
					in_data,
					this.constantService.getHttpJsonOptions()
				)
				.pipe(
					map((e: Response) => e),
					catchError((e: Response) => throwError(e))
				);
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	modifyUserProfilePic(userId, imageLink): Observable<any> {
		try {
			let formData: FormData = new FormData();
			formData.append('profile_pic', imageLink);

			return this.httpClient
				.post(
					`${this.apiEndPoint}/changePic/${userId}`,
					formData,
					this.constantService.getHttpFormDataOptions()
				)
				.pipe(
					map((e: Response) => e),
					catchError((e: Response) => throwError(e))
				);
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	deleteUserByUserId(userId): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/${userId}`;
			return this.httpClient
				.delete(url, this.constantService.getHttpJsonOptions())
				.pipe(
					map((e: Response) => e),
					catchError((e: Response) => throwError(e))
				);
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	blockUnblockUser(userId, in_data): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/setStatus/${userId}`;
			return this.httpClient
				.patch(url, in_data, this.constantService.getHttpJsonOptions())
				.pipe(
					map((e: Response) => e),
					catchError((e: Response) => throwError(e))
				);
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}

	deleteImageByUserId( in_imageUrl, userId ): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/${userId}/deletePic/${in_imageUrl}`;
			return this.httpClient
				.delete(url)
				.pipe(
					map((e: Response) => e),
					catchError((e: Response) => throwError(e))
				);
		} catch (ex) {
			console.log('ex', ex);
			let obj = {
				resCode: 400,
				msg: ex.toString(),
			};
			this.constantService.handleResCode(obj);
		}
	}
}
