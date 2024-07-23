import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TostarService {
  constructor(public tostar: ToastrService) {
    this.tostar.toastrConfig.preventDuplicates = true;
    this.tostar.toastrConfig.includeTitleDuplicates = true;
  }
  thankyouforcontactingus() {
    this.tostar.success('Thank you for contacting us')
  }
  pleaseloginbeforebuy() {
    this.tostar.success('Please login before buy')
  }
  somethingWentWrong() {
    this.tostar.success('Oops!! Something went wrong')
  }
  forgotpasswordemailsentsuccessfully() {
    this.tostar.success('Forgot password email has been sent successfully')
  }
  custom(val: string) {
    this.tostar.success(val);
  }
}
