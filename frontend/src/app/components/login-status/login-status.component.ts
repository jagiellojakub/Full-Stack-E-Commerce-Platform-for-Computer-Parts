import { CheckoutService } from './../../services/checkout.service';
import { OrderHistoryService } from './../../services/order-history.service';
import { ProfileService } from './../../services/profile.service';
import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';
  userFirstName: string = '';
  userLastName: string = '';
  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private profileService: ProfileService,
    private orderHistoryService: OrderHistoryService,
    private checkoutService: CheckoutService) { }

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  
  getUserDetails() {
    if (this.isAuthenticated) {

      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
          const [firstName, lastName] = this.userFullName.split(' ');

          this.userFirstName = firstName;
          this.userLastName = lastName;

          const theEmail = res.email;

          this.storage.setItem('userFirstName', JSON.stringify(this.userFirstName));
          this.storage.setItem('userLastName', JSON.stringify(this.userLastName));
          this.profileService.setEmail(theEmail);
          this.orderHistoryService.setEmail(theEmail);
          this.checkoutService.setEmail(theEmail);
        }
      );
    }
  }

  logout() {
    this.storage.clear();
    this.oktaAuth.signOut();
  }

}