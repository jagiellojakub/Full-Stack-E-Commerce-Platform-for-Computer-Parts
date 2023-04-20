import { CartService } from './../../services/cart.service';
import { CartItem } from './../../common/cart-item';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  currentCategoryId: string | null = null;
  previousCategoryId: string | null = null;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  previousKeyword: string = "";
  

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });  
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts()
    } else {
    this.handleListProducts();
    }
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
  
    if (hasCategoryId) {
      this.currentCategoryId = this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = null;
    }
  
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }
  
    this.previousCategoryId = this.currentCategoryId;
    this.productService.getSortedProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId,
                                               'name')
                                               .subscribe(this.processResult());
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }

  updatePageSize(pageSize: String) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements; 
    };
  }

  addToCart(theProduct: Product) {
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
