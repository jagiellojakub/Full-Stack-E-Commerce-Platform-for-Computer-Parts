import { OrderDetails } from './../../common/order-details';
import { OrderHistoryService } from './../../services/order-history.service';
import { OrderHistory } from './../../common/order-history';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit{
  orderHistoryList: OrderHistory[] = [];
  currentOrder: OrderDetails[] = [];

  constructor(private orderHistoryService: OrderHistoryService,
              private router: Router) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }
  handleOrderHistory() {
    const theEmail = this.orderHistoryService.getEmail();
  
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    )
  }

  showOrderDetails(orderId: string) {
    this.orderHistoryService.getOrderDetails(orderId).subscribe(
      data => {
      this.currentOrder = data._embedded.orderItems;
    });
  }

}
