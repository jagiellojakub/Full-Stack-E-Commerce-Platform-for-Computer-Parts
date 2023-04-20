import { ProductCategory } from './../common/product-category';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.shopUrl + '/products';
  private categoryUrl = environment.shopUrl + '/product-category';

  constructor(private httpClient: HttpClient) { }

  
  private getProducts(url: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(url).pipe(
      map(response => response._embedded.products)
    );
  }

  getSortedProductListPaginate(thePage: number,
                               thePageSize: number,
                               theCategoryId: string | null,
                               sortBy: string): Observable<GetResponseProducts> {
    let searchUrl: string;

    if (theCategoryId !== null) {
      searchUrl = `${this.baseUrl}/search/findByCategoryIdOrParentCategoryId?id=${theCategoryId}&sort=${sortBy}`;
    } else {
      searchUrl = `${this.baseUrl}?sort=${sortBy}`;
    }

    searchUrl += `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProduct(theProductId: string): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(theCategoryId: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryIdOrParentCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage:number, 
                         thePageSize:number, 
                         theKeyword: string): Observable<GetResponseProducts> {
  const searchUrl = `${this.baseUrl}/search/findByNameContainingIgnoreCase?name=${theKeyword}`
                  + `&page=${thePage}&size=${thePageSize}`;

  return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  },
  sort: {
    sorted: boolean,
    unsorted: boolean,
    empty: boolean
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}


