import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderTrackingService {
  orderTrackingNumber: string;
  private apiUrl = environment.shopUrl;

  constructor(private http: HttpClient) {}

  async findOrderByTrackingNumber(orderTrackingNumber: string): Promise<any> {
    try {
      const response = await this.http
        .get<any>(
          `${this.apiUrl}/orders/search/findByOrderTrackingNumber?orderTrackingNumber=${orderTrackingNumber}`
        )
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error searching for order:', error);
      throw error;
    }
  }

  async getOrderItems(orderItemsUrl: string): Promise<any> {
    try {
      const response = await this.http.get<any>(orderItemsUrl).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  }
}
