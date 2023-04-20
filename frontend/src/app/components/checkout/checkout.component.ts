import { OrderTrackingService } from 'src/app/services/order-tracking.service';
import { OrderTrackingComponent } from './../order-tracking/order-tracking.component';
import { ShippingMethod } from './../../common/shipping-method';
import { PaymentInfo } from './../../common/payment-info';
import { environment } from './../../../environments/environment.development';
import { Purchase } from './../../common/purchase';
import { OrderItem } from './../../common/order-item';
import { Router } from '@angular/router';
import { CheckoutService } from './../../services/checkout.service';
import { CartService } from './../../services/cart.service';
import { CustomValidators } from './../../validators/custom-validators';
import { State } from './../../common/state';
import { ShopFormService } from './../../services/shop-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { UserAddress } from 'src/app/common/user-address';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  shippingPrice: number;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;
  userAddresses: UserAddress[] = [];
  userDefaultAddress: UserAddress;

  selectedAddress: UserAddress;



  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router,
              private orderTrackingService: OrderTrackingService) {}

  ngOnInit(): void {

    this.setupStripePaymentForm();

    this.reviewCartDetails();

    
    const theFirstName = JSON.parse(this.storage.getItem('userFirstName')!);
    const theLastName = JSON.parse(this.storage.getItem('userLastName')!);

    this.shopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    ); 

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl(theFirstName, [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl(theLastName, [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        email: new FormControl(this.checkoutService.getEmail(), [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$")]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({})
    })

    if (this.checkoutService.getEmail() != "") {
      this.showUserAddress();
    }

  }
  setupStripePaymentForm() {
    var elements = this.stripe.elements();

    this.cardElement = elements.create('card', {hidePostalCode: true});

    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: any) => {

      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    })
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    let shippingMethod = this.cartService.selectedShippingMethod;

    const cartItems = this.cartService.cartItems;

    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;


    purchase.shippingMethod = shippingMethod;
    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice*100);
    this.paymentInfo.currency = "PLN";
    this.paymentInfo.receiptEmail = purchase.customer.email;


    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,

                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.billingAddressCountry.value.code
                  } 
                }
              }
            }, { handleActions: false })
            .then((result: any) => {
              if (result.error) {
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                    this.isDisabled = false;
                    const otn: string = response.orderTrackingNumber;
                    this.orderTrackingService.orderTrackingNumber = otn;
                    this.resetCart();
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }
            });
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/order-tracking");
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }
  
  setShippingAddress(address: UserAddress) {
    const country = this.countries.find(c => c.name === address.country);
    this.checkoutFormGroup.get('shippingAddress.country').setValue(country);
  
    this.shopFormService.getStates(country.code).subscribe(data => {
      this.shippingAddressStates = data;
      const state = this.shippingAddressStates.find(s => s.name === address.state);
      this.checkoutFormGroup.get('shippingAddress.state').setValue(state);
    });
  
    this.checkoutFormGroup.get('shippingAddress.street').setValue(address.street);
    this.checkoutFormGroup.get('shippingAddress.city').setValue(address.city);
    this.checkoutFormGroup.get('shippingAddress.zipCode').setValue(address.zipCode);
  }

  showUserAddress() {
    this.checkoutService.getUserAddresses().subscribe(
      data => {
      this.userAddresses = data._embedded.userAddresses;
      this.userDefaultAddress = this.userAddresses[0];
      this.setShippingAddress(this.userDefaultAddress);
    });
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === "shippingAddress") {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    )
  }

  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    
    this.cartService.shippingPrice.subscribe(
      data => this.shippingPrice = data
    );  
  }

}
