import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './../../services/profile.service';
import { UserAddress } from './../../common/user-address';
import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  userAddressFormGroup: FormGroup;

  countries: Country[] = [];

  states: State[] = [];

  userAddresses: UserAddress[] = [];

  isDisabled: boolean = false;

  showForm: boolean = false;

  tempAddress: UserAddress;

  constructor(private profileService: ProfileService,
              private formBuilder: FormBuilder,
              private router: Router) {}

  ngOnInit(): void {
    this.showForm = false;
    this.showUserAddress();
  }

  showUserAddress() {
    const theEmail = this.profileService.getEmail();
    this.profileService.getUserAddresses(theEmail).subscribe(
      data => {
      this.userAddresses = data._embedded.userAddresses;
    });
  }
  showUserAddressForm() {

    this.showForm = !this.showForm;

    this.userAddressFormGroup = this.formBuilder.group({
      userAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace])
      })
    });

    this.profileService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    ); 
  }

  deleteAddress(address: UserAddress): void {
    this.profileService.deleteUserAddress(address.id).subscribe(() => {
      this.userAddresses = this.userAddresses.filter(a => a !== address);
      this.refreshPage();
    });
  }

  setAsDefault(address: UserAddress): void {
    this.profileService.setAddressAsDefault(address).subscribe(
      () => {
        this.showUserAddress();
      },
      error => console.error('Error setting address as default:', error)
    );
  }

  onSubmit() {
    if (this.userAddressFormGroup.invalid) {
      this.userAddressFormGroup.markAllAsTouched();
      return;
    }

    let userAddress = new UserAddress();
    userAddress.street = this.userAddressFormGroup.get('userAddress.street').value;
    userAddress.city = this.userAddressFormGroup.get('userAddress.city').value;
    userAddress.state = this.userAddressFormGroup.get('userAddress.state').value.name;
    userAddress.country = this.userAddressFormGroup.get('userAddress.country').value.name;
    userAddress.zipCode = this.userAddressFormGroup.get('userAddress.zipCode').value;

  this.profileService.addUserAddress(userAddress).subscribe({
      next: (respone: any) => {
        alert(`Your address has been added succesfully`);
        this.refreshPage();
      },
      error: (err: any) => {
        alert(`There was an error: ${err.message}`);
      }
    }); 
  }

  getStates(formGroupName: string) {

    const formGroup = this.userAddressFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;

    this.profileService.getStates(countryCode).subscribe(
      data => {
        this.states = data;
        formGroup.get('state').setValue(data[0]);
      }
    )
  }

  get userAddressStreet() { return this.userAddressFormGroup.get('userAddress.street'); }
  get userAddressCity() { return this.userAddressFormGroup.get('userAddress.city'); }
  get userAddressState() { return this.userAddressFormGroup.get('userAddress.state'); }
  get userAddressCountry() { return this.userAddressFormGroup.get('userAddress.country'); }
  get userAddressZipCode() { return this.userAddressFormGroup.get('userAddress.zipCode'); }

  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  //STYLING
  //DELETE
  
  onDeleteButtons(address: UserAddress) {
    const deleteBtn = document.getElementById(`delete-btn-${address.id}`);
    const confirmBtn = document.getElementById(`confirm-delete-btn-${address.id}`);
    const cancelBtn = document.getElementById(`cancel-delete-btn-${address.id}`);
  
    deleteBtn.classList.add("hide");
    confirmBtn.classList.remove("hide");
    cancelBtn.classList.remove("hide");
  }
  
  onConfirmDeleteButtons(address: UserAddress) {
    const deleteBtn = document.getElementById(`delete-btn-${address.id}`);
    const confirmBtn = document.getElementById(`confirm-delete-btn-${address.id}`);
    const cancelBtn = document.getElementById(`cancel-delete-btn-${address.id}`);
  
    deleteBtn.classList.remove("hide");
    confirmBtn.classList.add("hide");
    cancelBtn.classList.add("hide");
  }
  
  onCancelDeleteButtons(address: UserAddress) {
    const deleteBtn = document.getElementById(`delete-btn-${address.id}`);
    const confirmDeleteBtn = document.getElementById(`confirm-delete-btn-${address.id}`);
    const cancelBtn = document.getElementById(`cancel-delete-btn-${address.id}`);
  
    deleteBtn.classList.remove("hide");
    confirmDeleteBtn.classList.add("hide");
    cancelBtn.classList.add("hide");
  }
  
  onConfirmDeleteBtnClick(address: UserAddress) {
    this.onConfirmDeleteButtons(address);
    this.deleteAddress(address);
  }

}
