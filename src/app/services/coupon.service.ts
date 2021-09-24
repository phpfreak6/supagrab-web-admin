import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

    public apiEndPoint: string;
	public data;

	constructor(
		private httpClient: HttpClient,
		private constantService: ConstantService
	) {
		this.apiEndPoint = this.constantService.apiBaseUrl + '/coupons';
	}

    getById(couponId): Observable<any> {
		let url = `${this.apiEndPoint}/${couponId}`;
		return this.httpClient
			.get(url, this.constantService.getHttpJsonOptions())
			.pipe(
				map((e: Response) => e),
				catchError((e: Response) => throwError(e))
			);
	}

	getAll(search): Observable<any> {
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

	insert(in_data): Observable<any> {
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

	update(in_data, couponId): Observable<any> {
		try {
			return this.httpClient
				.patch(
					`${this.apiEndPoint}/${couponId}`,
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

	deleteById(couponId): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/${couponId}`;
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

	blockUnblock(couponId, in_data): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/${couponId}`;
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
}
