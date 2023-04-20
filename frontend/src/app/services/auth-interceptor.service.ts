import { environment } from './../../environments/environment';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next))
  }
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    const theEndpoint = environment.shopUrl + "/orders";
    const userAddressesEndpoint = environment.shopUrl + "/userAddresses";
    const searchByOrderTrackingNumberEndpoint = environment.shopUrl + "/orders/search/findByOrderTrackingNumber";
    const securedEndpoints = [theEndpoint, userAddressesEndpoint, searchByOrderTrackingNumberEndpoint];
    const openEndpoints = [searchByOrderTrackingNumberEndpoint];

    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {
      const isAuthenticated = await this.oktaAuth.isAuthenticated();
      if (isAuthenticated) {
        const accessToken = await this.oktaAuth.getAccessToken();
        if (accessToken) {
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + accessToken
            }
          });
        }
      }
    }

    return await lastValueFrom(next.handle(request));
  }
}
