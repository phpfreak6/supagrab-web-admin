import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ConstantService } from './constant.service';

@Injectable({
	providedIn: 'root'
})
export class DepartmentService {

	public apiEndPoint: string;
	public data;
	public departmentImageLink;

	constructor(
		private httpClient: HttpClient,
		private constantService: ConstantService
	) {
		this.apiEndPoint = this.constantService.apiBaseUrl + '/departments';
		this.departmentImageLink = this.constantService.departmentImageLink;
	}

	getDepartmentById(deptId): Observable<any> {
		let url = `${this.apiEndPoint}/${deptId}`;
		return this.httpClient
			.get(url, this.constantService.getHttpJsonOptions())
			.pipe(
				map((e: Response) => e),
				catchError((e: Response) => throwError(e))
			);
	}

	getAllDepartments(search): Observable<any> {
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

	insertDepartment(in_data): Observable<any> {
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

	updateDepartment(in_data, deptId): Observable<any> {
		try {
			return this.httpClient
				.patch(
					`${this.apiEndPoint}/${deptId}`,
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

	modifyDepartmentProfilePic(deptId, imageLink): Observable<any> {
		try {
			let formData: FormData = new FormData();
			formData.append('profile_pic', imageLink);

			return this.httpClient
				.post(
					`${this.apiEndPoint}/changePic/${deptId}`,
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

	deleteDepartmentByDepartmentId(deptId): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/${deptId}`;
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

	blockUnblockDepartment(deptId, in_data): Observable<any> {
		try {
			return this.httpClient
				.patch(
					`${this.apiEndPoint}/${deptId}`,
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

	deleteImageByDepartmentId( in_imageUrl, deptId ): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/${deptId}/deletePic/${in_imageUrl}`;
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
