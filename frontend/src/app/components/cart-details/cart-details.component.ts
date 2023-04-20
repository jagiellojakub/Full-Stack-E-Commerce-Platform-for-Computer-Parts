import { ShippingMethod } from './../../common/shipping-method';
import { ShippingMethodService } from './../../services/shipping-method.service';
import { CartService } from './../../services/cart.service';
import { CartItem } from './../../common/cart-item';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit{
  
  cartItems: CartItem[] = [];
  shippingMethods: ShippingMethod[] = [];
  selectedShippingMethod: ShippingMethod;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService,
              private shippingMethodService: ShippingMethodService) {}

  
  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    
    this.shippingMethodService.getShippingMethods().subscribe(
      (data) => {
        this.shippingMethods = data._embedded.shippingMethods;
        this.selectedShippingMethod = this.shippingMethods[0];
        this.cartService.setShippingMethod(this.selectedShippingMethod);
        this.cartService.computeCartTotals();
      }
    );
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  onShippingMethodChange(shippingMethodId: any) {
    const selectedShippingMethod = this.shippingMethods.find(method => method.id === shippingMethodId);
    if (selectedShippingMethod) {
      this.cartService.setShippingMethod(selectedShippingMethod);
      this.selectedShippingMethod = selectedShippingMethod;
      this.cartService.computeCartTotals();
    }
  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
      this.cartService.decrementQuantity(theCartItem);

      if (theCartItem.quantity === 0) {
          this.remove(theCartItem);
      }
  }
  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }

}
