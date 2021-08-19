import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ConstantService } from './constant.service';

@Injectable({
	providedIn: 'root'
})
export class ProductService {

	public apiEndPoint: string;
	public data;
	public productImageLink;

	constructor(
		private httpClient: HttpClient,
		private constantService: ConstantService
	) {
		this.apiEndPoint = this.constantService.apiBaseUrl + '/products';
		this.productImageLink = this.constantService.productImageLink;
	}

	getProductById(productId): Observable<any> {
		let url = `${this.apiEndPoint}/${productId}`;
		return this.httpClient
			.get(url, this.constantService.getHttpJsonOptions())
			.pipe(
				map((e: Response) => e),
				catchError((e: Response) => throwError(e))
			);
	}

	getAllProducts(search): Observable<any> {
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

	insertProduct(in_data): Observable<any> {
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

	updateProduct(in_data, productId): Observable<any> {
		try {
			return this.httpClient
				.patch(
					`${this.apiEndPoint}/${productId}`,
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

	modifyProductProfilePic(productId, imageLink): Observable<any> {
		try {
			let formData: FormData = new FormData();
			formData.append('profile_pic', imageLink);

			return this.httpClient
				.post(
					`${this.apiEndPoint}/changePic/${productId}`,
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

	deleteProductByProductId(productId): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/${productId}`;
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

	blockUnblockProduct(productId, in_data): Observable<any> {
		try {
			// let url = `${this.apiEndPoint}/setStatus/${productId}`;
			let url = `${this.apiEndPoint}/setStatus/${productId}`;
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

	deleteImageByProductId( in_imageId, productId ): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/delete-uploaded-image/${productId}/${in_imageId}`;
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

	isProductSlugExists( in_slug ): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/slug-exists/${in_slug}`;
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

	uploadImages( productId,imageLink ):Observable<any> {
		try {
			let formData: FormData = new FormData();
			formData.append('profile_pic', imageLink);

			return this.httpClient
				.post(
					`${this.apiEndPoint}/upload-images/${productId}`,
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

	setPrimary(in_primary, image_id, productId ): Observable<any> {
		try {
			let in_data = {
				default: in_primary
			}
			let url = `${this.apiEndPoint}/set-image-primary/${productId}/${image_id}`;
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

	getAllProductAttributes( prodId, search): Observable<any> {
		try {
			let url = `${this.apiEndPoint}/${prodId}/attributes`;
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

	getAttrById( prodId, attrId): Observable<any> {
		let url = `${this.apiEndPoint}/${prodId}/attributes/${attrId}`;
		return this.httpClient
			.get(url, this.constantService.getHttpJsonOptions())
			.pipe(
				map((e: Response) => e),
				catchError((e: Response) => throwError(e))
			);
	}

	insertProductAttribute( prodId, in_data): Observable<any> {
		try {
			return this.httpClient
				.post(
					`${this.apiEndPoint}/${prodId}/attributes`,
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

	updateProductAttribute(prodId, attrId, in_data): Observable<any> {
		try {
			return this.httpClient
				.patch(
					`${this.apiEndPoint}/${prodId}/attributes/${attrId}`,
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
