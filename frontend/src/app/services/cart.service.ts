import { ShippingMethod } from './../common/shipping-method';
import { CartItem } from './../common/cart-item';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  selectedShippingMethod: ShippingMethod;

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  shippingPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() { 
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;
      this.selectedShippingMethod = { id: "dda47df9-400e-48f4-875a-c63b22c02f9d", name: 'DHL', price: 9.99 };
      this.computeCartTotals();
    }
  }

  
  addToCart(theCartItem: CartItem) {

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  setShippingMethod(shippingMethod: ShippingMethod) {
    if (shippingMethod) {
      this.selectedShippingMethod = shippingMethod;
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }
    if (totalPriceValue != 0) {
      totalPriceValue += this.selectedShippingMethod.price;
    }

    this.totalPrice.next(totalPriceValue);
    this.shippingPrice.next(this.selectedShippingMethod.price);
    this.totalQuantity.next(totalQuantityValue);

    this.persistCartItems();
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems)); 
  }
}
