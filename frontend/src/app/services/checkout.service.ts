import { PaymentInfo } from './../common/payment-info';
import { CartService } from './cart.service';
import { Observable, of } from 'rxjs';
import { Purchase } from './../common/purchase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserAddress } from '../common/user-address';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private email: string = '';
  
  private paymentIntentUrl = environment.shopUrl + '/checkout/payment-intent';

  private purchaseUrl = environment.shopUrl + '/checkout/purchase';

  private userAddressUrl = environment.shopUrl + '/userAddresses';

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }

  getUserAddresses(): Observable<GetResponseUserAddress> {
    if (this.email != "") {
      const searchUrl = `${this.userAddressUrl}/search/findByEmailOrderByIsDefaultDesc?email=${this.email}`;
      return this.httpClient.get<GetResponseUserAddress>(searchUrl);
    }
    return null;
  }

  getUserDefaultAddress(): Observable<GetResponseUserDefaultAddress> {
      const searchUrl = `${this.userAddressUrl}/search/findByEmailAndIsDefault?email=${this.email}&isDefault=true`;
      return this.httpClient.get<GetResponseUserDefaultAddress>(searchUrl);
    }

  setEmail(theEmail: string) {
    this.email = theEmail;
  }
  getEmail() {
    return this.email;
  }
}

interface GetResponseUserAddress{
  _embedded: {
    userAddresses: UserAddress[];
  }
}
interface GetResponseUserDefaultAddress{
  _embedded: {
    userDefaultAddress: UserAddress;
  }
}
