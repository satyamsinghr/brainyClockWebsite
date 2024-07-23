import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Package } from 'src/app/model/package.model';
import { PackageService } from 'src/app/services/packages.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TostarService } from 'src/app/services/tostar.service';
import { environment } from 'src/environments/environment';
import { KeyCode } from '../../enum/keyCode.enum';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-paymentoption',
  templateUrl: './paymentoption.component.html',
  styleUrls: ['./paymentoption.component.css']
})
export class PaymentoptionComponent implements OnInit {

  paymentForm: FormGroup;
  paymentHandler: any = null;
  packageType: any;
  ispaymentSuccessfull: boolean = false;
  submitted = false;
  matserCardRegex = /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/;
  visacardRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
  americanExpressRegex = /^3[47][0-9]{13}$/;
  expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  cvvRegex = /^[0-9]{3}$/;
  usZipCode = /^\d{5}(-\d{4})?$/;
  nameRegex = /^((?:[A-Za-z]+ ?){1,3})$/;
  packageDetails: Package;
  key = environment.stripePublishKey;
  constructor(private tostar: TostarService, public packageService: PackageService, private router: Router, private spinner: NgxSpinnerService, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private repo: RepositoryService) { }

  ngOnInit(): void {
    this.invokeStripe();
    this.paymentForm = this.formBuilder.group({
      nameOnCard: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiry: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.maxLength(3)]],
      streetAddress: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]]
    });
    this.packageService.packageType.subscribe((val) => {
      this.packageType = val;
      console.log("Package Type", val)
    });
    this.packageDetails = this.packageService.get(this.packageType);
  }

  get f() { return this.paymentForm.controls; }

  cancelTransaction() {
    this.setPackage();
    this.router.navigate(['/checkout']);
  }

  makePayment() {
    this.subscriptionValue = this.packageService.pacakeFinalPrice(this.packageService.packageType.value)
    this.subscriptionName =this.packageService.getPackageName(this.packageService.packageType.value)
    this.submitted = true;
    if (this.paymentForm.invalid) {

      this.validation();
      return;
    }

    if (this.packageService.isTrial.value == undefined) {
      this.tostar.somethingWentWrong();
      return false;
    }

    this.setPackage();
    this.router.navigate(['/subscription-successfull']);

  }

  validation() {
    if (this.paymentForm.controls.nameOnCard.errors?.required) {
      this.tostar.custom('Name on card is required2');
    }
    else if (this.paymentForm.controls.nameOnCard.value.toString().match(this.nameRegex) == null) {
      this.tostar.custom('Please Enter Valid name');
    }
    else if (this.paymentForm.controls.cardNumber.errors?.required) {
      this.tostar.custom('Card Number is required');
    } else if (this.cardValidation()) {
      this.tostar.custom('Invalid Card Number');
    }
    else if (this.paymentForm.controls.expiry.errors?.required) {
      this.tostar.custom('Card Expiry is required');
    }
    else if (this.paymentForm.controls.expiry.value.toString().match(this.expiryDateRegex) == null) {
      this.tostar.custom('Card Expiry Date is not valid');
    }
    else if (this.paymentForm.controls.cvv.errors?.required) {
      this.tostar.custom('CVV is required');
    }
    else if (this.paymentForm.controls.cvv.errors?.maxLength) {
      this.tostar.custom('CVV does not contain more than 3 numbers');
    }
    else if (this.paymentForm.controls.cvv.value.toString().match(this.cvvRegex) == null) {
      this.tostar.custom('CVV is not valid');
    }
    else if (this.paymentForm.controls.streetAddress.errors?.required) {
      this.tostar.custom('Billing Address is required');
    }
    else if (this.paymentForm.controls.state.errors?.required) {
      this.tostar.custom('State/Province Number is required');
    }
    else if (this.paymentForm.controls.city.errors?.required) {
      this.tostar.custom('City is required');
    }
    else if (this.paymentForm.controls.zipCode.errors?.required) {
      this.tostar.custom('Zip Code is required');
    }
    else if (this.paymentForm.controls.zipCode.value.toString().match(this.usZipCode) == null) {
      this.tostar.custom('Invalid Zip Code');
    }
  }

  onKey(event) {
    let expiryVal = this.paymentForm.controls['expiry'].value;
    if ((isFinite(event.key) && event.key != '') || event.keyCode == KeyCode.BackSpace) {
      if (expiryVal.length < 5) {
        if (expiryVal.length === 2) {
          if (!expiryVal.includes('/')) {
            this.paymentForm.controls['expiry'].setValue(expiryVal + '/');
          }
        }

        if (expiryVal.includes('/') && event.keyCode != KeyCode.BackSpace) {
          var expiryParts = expiryVal.split('/');
          if (expiryParts[0].length == 2) {
            this.paymentForm.controls['expiry'].setValue(expiryVal + event.key);
            event.preventDefault();
          }
        }
      } else if (event.keyCode != KeyCode.BackSpace) {
        event.preventDefault();
      }
      if (expiryVal.length >= 3 && event.keyCode == KeyCode.BackSpace && event.target.selectionStart == 3) {
        event.preventDefault();
        return;
      }
    } else if (event.keyCode != KeyCode.LeftArrow && event.keyCode != KeyCode.RighArrow) {
      event.preventDefault();
    }
  }

  onCardNumberKey(event) {
    let cardNumberVal = this.paymentForm.controls.cardNumber.value;
    if ((isFinite(event.key) && event.key != '')) {
      if (cardNumberVal.length < 19) {
        if (cardNumberVal.length === 4) {
          this.paymentForm.controls.cardNumber.setValue(cardNumberVal + '-');
        } else if (cardNumberVal.length === 9) {
          this.paymentForm.controls.cardNumber.setValue(cardNumberVal + '-');
        } else if (cardNumberVal.length === 14) {
          this.paymentForm.controls.cardNumber.setValue(cardNumberVal + '-');
        }
      } else if (event.keyCode != KeyCode.BackSpace) {
        event.preventDefault();
      }
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  cardValidation() {
    if (this.paymentForm.controls.cardNumber.value.toString().match(this.matserCardRegex) == null &&
      this.paymentForm.controls.cardNumber.value.toString().match(this.visacardRegex) == null &&
      this.paymentForm.controls.cardNumber.value.toString().match(this.americanExpressRegex == null)) {
      return true;
    }
    return false;

  }
  private setPackage() {
    this.packageService.isTrial.next(this.packageService.isTrial.value);
    this.packageService.packageType.next(this.packageService.packageType.value);
  }
  subscriptionValue:any
  subscriptionName:any
  stripeToken:any
  makePaymentByStripe() {
    let amount = this.packageService.pacakeFinalPrice(this.packageService.packageType.value)
    this.subscriptionValue = this.packageService.pacakeFinalPrice(this.packageService.packageType.value)
    this.subscriptionName =this.packageService.getPackageName(this.packageService.packageType.value)
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.key,
      locale: 'auto',
      token: (stripeToken: any) => { 
        this.stripeToken= stripeToken.id
        console.log(stripeToken);
        if (stripeToken) {
          this.spinner.show();
          this.repo.payment('subscription/payment',this.subscriptionValue,this.subscriptionName,this.stripeToken)
          .pipe(first())
          .subscribe(
            data => {
              const res: any = data;
              localStorage.setItem('payment', JSON.stringify('done'))
              this.spinner.hide();
              this.tostar.custom('Payment has been successfull');
              this.router.navigate(['']);
            },
            error => {
              this.spinner.hide();
              this.tostar.custom(error.error.msg);
              this.router.navigate(['']);
            });
          // this.repo.payment('company/mail')
          // .pipe(first())
          // .subscribe(
          //   data => {
          //     const res: any = data;
          //     localStorage.setItem('payment', JSON.stringify('done'))
          //     this.spinner.hide();
          //     this.tostar.custom('Payment has been successfull');
          //     this.router.navigate(['']);
          //   },
          //   error => {
          //     this.spinner.hide();
          //     this.tostar.custom(error.error.msg);
          //     this.router.navigate(['']);
          //   });
        }
      },
    });

    paymentHandler.open({
      name: 'BrainyClock',
      description: this.packageService.getPackageName(this.packageService.packageType.value) + ' ' + 'Package',
      // amount: this.packageDetails.price * 12 * parseFloat(amount),
      amount:  parseFloat(amount) * 100,
    });
   
  }
  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.key,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
}
