import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ConstantService } from './constant.service';

@Injectable({
	providedIn: 'root'
})
export class OrderService {

	public apiEndPoint: string;
	public data;
	public userImageLink;

	constructor(
		private httpClient: HttpClient,
		private constantService: ConstantService
	) {
		this.apiEndPoint = this.constantService.apiBaseUrl + '/orders';
		this.userImageLink = this.constantService.userImageLink;
	}

	getOrderById(orderId): Observable<any> {
		let url = `${this.apiEndPoint}/${orderId}`;
		return this.httpClient
			.get(url, this.constantService.getHttpJsonOptions())
			.pipe(
				map((e: Response) => e),
				catchError((e: Response) => throwError(e))
			);
	}

	getAllOrders(search): Observable<any> {
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

	updateOrder(in_data, orderId): Observable<any> {
		try {
			return this.httpClient
				.patch(
					`${this.apiEndPoint}/${orderId}`,
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
}
