import { LoginStatusComponent } from './../login-status/login-status.component';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OrderTrackingService } from 'src/app/services/order-tracking.service';
import { OktaAuthStateService } from '@okta/okta-angular';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css']
})
export class OrderTrackingComponent implements OnInit{
  orderTrackingNumber = '';
  orderData: any;
  isAuthenticated: boolean = false;

  constructor(private orderTrackingService: OrderTrackingService,
              private oktaAuthService: OktaAuthStateService) {}

  ngOnInit(): void {
    if (this.orderTrackingService.orderTrackingNumber) {
      this.orderTrackingNumber = this.orderTrackingService.orderTrackingNumber;
      this.orderTrackingService.orderTrackingNumber = null; 
      this.handleSearch();
    }
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
      }
    );
  }

  async handleSearch() {
    try {
      this.orderData = await this.orderTrackingService.findOrderByTrackingNumber(this.orderTrackingNumber);
      const orderItemsResponse = await this.orderTrackingService.getOrderItems(this.orderData._links.orderItems.href);
      this.orderData.orderItems = orderItemsResponse._embedded?.orderItems || [];
    } catch (error) {
      console.error('Error searching for order:', error);
    }
  }
  async orderDetails(orderTrackingNumber: string) {
    try {
      this.orderData = await this.orderTrackingService.findOrderByTrackingNumber(orderTrackingNumber);

      const orderItemsResponse = await this.orderTrackingService.getOrderItems(this.orderData._links.orderItems.href);
      this.orderData.orderItems = orderItemsResponse._embedded?.orderItems || [];
    } catch (error) {
      console.error('Error searching for order:', error);
    }
  }
}
