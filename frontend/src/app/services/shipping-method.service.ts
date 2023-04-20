import { HttpClient } from '@angular/common/http';
import { ShippingMethod } from './../common/shipping-method';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingMethodService {

  private shippingMethodUrl = environment.shopUrl + "/shippingMethods";

  constructor(private httpClient: HttpClient) { }

  getShippingMethods() {
    return this.httpClient.get<GetResponseShippingMethods>(this.shippingMethodUrl);
  }
}
interface GetResponseShippingMethods{
  _embedded: {
    shippingMethods: ShippingMethod[];
  }
}