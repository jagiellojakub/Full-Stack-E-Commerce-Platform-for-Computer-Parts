import { UserAddress } from './../common/user-address';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, Observable, switchMap } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private countriesUrl = environment.shopUrl + '/countries';
  private statesUrl = environment.shopUrl + '/states';

  private email: string = '';

  private userAddressUrl = environment.shopUrl + '/userAddresses';

  constructor(private httpClient: HttpClient) { }

  getUserAddresses(email: string): Observable<GetResponseUserAddress> {
    const searchUrl = `${this.userAddressUrl}/search/findByEmailOrderByIsDefaultDesc?email=${email}`;
    return this.httpClient.get<GetResponseUserAddress>(searchUrl);
  }

  addUserAddress(userAddress: UserAddress): Observable<any> {
    const email = this.getEmail();
    userAddress.email = email;
  
    return this.getUserAddresses(email).pipe(
      switchMap((addresses: GetResponseUserAddress) => {
        if (addresses._embedded.userAddresses.length === 0) {
          userAddress.default = true;
          return this.httpClient.post<UserAddress>(this.userAddressUrl, userAddress);
        } else {
          const defaultAddress = addresses._embedded.userAddresses.find(addr => addr.default === true);
          if (defaultAddress) {
            return this.httpClient.post<UserAddress>(this.userAddressUrl, userAddress);
          } else {
            userAddress.default = true;
            return this.httpClient.post<UserAddress>(this.userAddressUrl, userAddress);
          }
        }
      })
    );
  }
  deleteUserAddress(userAddressId: string): Observable<any> {
    const deleteUrl = `${this.userAddressUrl}/${userAddressId}`;
    const email = this.getEmail();
    
    return this.getUserAddresses(email).pipe(
      switchMap((addresses: GetResponseUserAddress) => {
        const addressToDelete = addresses._embedded.userAddresses.find(a => a.id === userAddressId);
        if (!addressToDelete) {
          throw new Error('User address not found');
        }

        if (addressToDelete.default) {
          const remainingAddresses = addresses._embedded.userAddresses.filter(a => a.id !== userAddressId);
          const newDefaultAddress = remainingAddresses.find(a => a.default === true) || remainingAddresses[0];
  
          if (newDefaultAddress) {
            return this.httpClient.delete(deleteUrl).pipe(
              switchMap(() => {
                newDefaultAddress.default = true;
                return this.httpClient.put(this.userAddressUrl + '/' + newDefaultAddress.id, newDefaultAddress);
              })
            );
          } else {
            return this.httpClient.delete(deleteUrl);
          }
        } else {
          return this.httpClient.delete(deleteUrl);
        }
      })
    );
  }
  setAddressAsDefault(address: UserAddress): Observable<any> {
    const email = this.getEmail();
    const url = `${this.userAddressUrl}/search/findByEmailAndIsDefault?email=${email}&isDefault=true`;
  
    return this.httpClient.get<GetResponseUserAddress>(url).pipe(
      switchMap(data => {
        const currentDefaultAddress = data._embedded.userAddresses[0];
        currentDefaultAddress.default = false;
        return this.httpClient.put(this.userAddressUrl + '/' + currentDefaultAddress.id, currentDefaultAddress).pipe(
          switchMap(() => {
            address.default = true;
            return this.httpClient.put(this.userAddressUrl + '/' + address.id, address);
          })
        );
      })
    );
  }
  updateUserAddress(userAddress: UserAddress): Observable<any> {
    const email = this.getEmail();
    userAddress.email = email;
  
    return this.getUserAddresses(email).pipe(
      switchMap((addresses: GetResponseUserAddress) => {
        const existingAddress = addresses._embedded.userAddresses.find(
          address => address.id === userAddress.id
        );
  
        if (existingAddress && existingAddress.default && !userAddress.default) {
          const remainingAddresses = addresses._embedded.userAddresses.filter(
            address => address.id !== userAddress.id
          );
          if (remainingAddresses.length > 0) {
            const newDefaultAddress = remainingAddresses[0];
            newDefaultAddress.default = true;
            this.updateUserAddress(newDefaultAddress).subscribe();
          }
        }
  
        return this.httpClient.put<UserAddress>(
          `${this.userAddressUrl}/${userAddress.id}`,
          userAddress
        );
      })
    );
  }
  setEmail(email: string) {
    this.email = email;
  }
  getEmail() {
    return this.email;
  }
  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }
  getStates(theCountryCode): Observable<State[]>{

    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    )
  }
}
interface GetResponseUserAddress{
  _embedded: {
    userAddresses: UserAddress[];
  }
}
interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}
interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}