import { AuthInterceptorService } from './services/auth-interceptor.service';
import { SearchComponent } from './components/search/search.component';
import { ProductService } from './services/product.service';
import { Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProductListComponent } from "./components/product-list/product-list.component";
import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import {
    OktaAuthGuard,
    OktaAuthModule,
    OktaCallbackComponent,
    OKTA_CONFIG 
  } from '@okta/okta-angular';
  
  import { OktaAuth } from '@okta/okta-auth-js';
  
  import myAppConfig from './config/my-app-config';
import { ProfileComponent } from './components/profile/profile.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ShippingMethodComponent } from './components/shipping-method/shipping-method.component';
import { OrderTrackingComponent } from './components/order-tracking/order-tracking.component';

  const oktaConfig = myAppConfig.oidc;
  
  const oktaAuth = new OktaAuth(oktaConfig);

  function sentToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
    const router = injector.get(Router);

    router.navigate(['/login']);
  }

const routes: Routes = [
    {path: 'order-tracking', component: OrderTrackingComponent},
    {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard],
                      data: { onAuthRequired: sentToLoginPage }},
    {path: 'profile', component: ProfileComponent, canActivate: [OktaAuthGuard],
                      data: { onAuthRequired: sentToLoginPage }},
    {path: 'login/callback', component: OktaCallbackComponent},
    {path: 'login', component: LoginComponent},
    
    {path: 'checkout', component: CheckoutComponent},
    {path: 'cart-details', component: CartDetailsComponent},
    {path: 'products/:id', component: ProductDetailsComponent},
    {path: 'search/:keyword', component: ProductListComponent},
    {path: 'category/:id', component: ProductListComponent},
    {path: 'category', component: ProductListComponent},
    {path: 'products', component: ProductListComponent},
    {path: '', redirectTo: '/products', pathMatch: 'full'},
    {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
    declarations: [
        AppComponent,
        ProductListComponent,
        ProductCategoryMenuComponent,
        SearchComponent,
        ProductDetailsComponent,
        CartStatusComponent,
        CartDetailsComponent,
        CheckoutComponent,
        LoginComponent,
        LoginStatusComponent,
        ProfileComponent,
        OrderHistoryComponent,
        ShippingMethodComponent,
        OrderTrackingComponent
    ],
    providers: [ProductService, { provide: OKTA_CONFIG, useValue: { oktaAuth }},
                {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
                
    bootstrap: [AppComponent],
    imports: [
        RouterModule.forRoot(routes),
        CommonModule,
        FormsModule,
        BrowserModule,
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        OktaAuthModule
    ]
})
export class AppModule { }
