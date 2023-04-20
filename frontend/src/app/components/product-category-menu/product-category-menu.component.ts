import { HttpClient } from '@angular/common/http';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit{

  productCategories: ProductCategory[] = [];
  
  constructor(private productService: ProductService,
              private httpClient: HttpClient) {}
  
  ngOnInit() {
    this.listProductCategories();
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      (data: any) => {
        let categories = data;
        let topLevelCategories = categories.filter((category: any) => category.parent === null);
  
        topLevelCategories.forEach((topLevelCategory: any) => {
          this.httpClient.get(topLevelCategory._links.subcategories.href).subscribe((subcategories: any) => {
            topLevelCategory.subcategories = subcategories._embedded.productCategory;
          });
        });
  
        this.productCategories = topLevelCategories;
      }
    );
  }
}
