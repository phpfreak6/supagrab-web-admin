import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ConstantService } from './constant.service';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {

	public apiEndPoint: string;
	public data;
	public categoryImageLink;

	constructor(
		private httpClient: HttpClient,
		private constantService: ConstantService
	) {
		// this.apiEndPoint = this.constantService.apiBaseUrl;
		this.categoryImageLink = this.constantService.categoryImageLink;
	}

    async setCatgApiEndPoint( deptId ) {
        
		console.log('inside setCatgApiEndPoint');
        this.apiEndPoint = this.constantService.apiBaseUrl;
        this.apiEndPoint +=  `/departments/${deptId}/categories`;
		console.log('this.apiEndPoint', this.apiEndPoint);
        return true;
    }

	getCategoryById(catgId): Observable<any> {
		let url = `${this.apiEndPoint}/${catgId}`;
		return this.httpClient
			.get(url, this.constantService.getHttpJsonOptions())
			.pipe(
				map((e: Response) => e),
				catchError((e: Response) => throwError(e))
			);
	}

	getAllCategories(search): Observable<any> {
		try {
            console.log('inside categories');
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

	insertCategory(in_data): Observable<any> {
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

	updateCategory(in_data, deptId): Observable<any> {
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

	modifyCategoryProfilePic(deptId, imageLink): Observable<any> {
		try {
			let formData: FormData = new FormData();
			formData.append('image', imageLink);

			return this.httpClient
				.post(
					`${this.apiEndPoint}/${deptId}/image`,
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

	deleteCategoryByCategoryId(deptId): Observable<any> {
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

	blockUnblockCategory(deptId, in_data): Observable<any> {
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

	deleteImageByCategoryId( in_imageUrl, deptId ): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/${deptId}/delete-image/${in_imageUrl}`;
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

	isCategorySlugExists( in_slug ) {
		try {
			let url = `${this.apiEndPoint}/slugExists?category_slug=${in_slug}`;
			return this.httpClient
				.get(url)
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

