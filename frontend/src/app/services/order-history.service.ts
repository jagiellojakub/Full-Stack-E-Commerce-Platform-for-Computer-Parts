import { OrderDetails } from './../common/order-details';
import { OrderHistory } from './../common/order-history';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.shopUrl + '/orders';
  private orderItemsUrl = environment.shopUrl + '/orderItems';
  private email: string = "";

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }

  getOrderDetails(orderId: string): Observable<GetResponseOrderItem> {
    const orderItemsUrl = `${this.orderItemsUrl}/search/findByOrderId?orderId=${orderId}`;
    return this.httpClient.get<GetResponseOrderItem>(orderItemsUrl);
  }
  getEmail() {
    return this.email;
  }
  setEmail(email: string) {
    this.email = email;
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}

interface GetResponseOrderItem {
   _embedded: {
    orderItems: OrderDetails[];
  }
}