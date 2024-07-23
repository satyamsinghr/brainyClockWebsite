import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PackageService } from 'src/app/services/packages.service';
import { TostarService } from 'src/app/services/tostar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Package } from 'src/app/model/package.model';
import { KeyCode } from '../../enum/keyCode.enum';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { RepositoryService } from 'src/app/services/repository.service';
import { first } from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  paymentForm: FormGroup;
  paymentHandler: any = null;
  noOfEmployees : number
  packageType: any;
  packageDetails: Package;
  key = environment.stripePublishKey;
  ispaymentSuccessfull: boolean = false;
  isInputChange: boolean = false;
  submitted = false;
  matserCardRegex = /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/;
  visacardRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
  americanExpressRegex = /^3[47][0-9]{13}$/;
  expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  cvvRegex = /^[0-9]{3}$/;
  usZipCode = /^\d{5}(-\d{4})?$/;
  nameRegex = /^((?:[A-Za-z]+ ?){1,3})$/;
  trial : any
  constructor(private repo: RepositoryService,private spinner: NgxSpinnerService,private tostar: TostarService,public packageService: PackageService, private router: Router, private formBuilder: FormBuilder, private translateService: TranslateService,) { }
  user:any
  visitedBefore:any
  pricee:any
  totalAmmount:any
  noOfFreeEmployees : number =1;
  selectedType: number = 1; 
  selectedLanguage:any;
  ngOnInit(): void {

    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      this.selectedLanguage = storedLanguage;
      this.translateService.use(storedLanguage);
    } else {
      this.selectedLanguage = 'en';
      this.translateService.use(this.selectedLanguage);
    }

    this.user = JSON.parse(localStorage.getItem('user'));
    this.trial = JSON.parse(localStorage.getItem('isTrial'));
    this.getOrder();
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
    if(this.packageService.packageType.value === undefined ||this.packageService.packageType.value === null){
   this.visitedBefore = localStorage.getItem('packageType')
      this.subscriptionValue = this.packageService.pacakeFinalPrice(+this.visitedBefore);
      this.subscriptionName =this.packageService.getPackageName(+this.visitedBefore);
      this.pricee=this.packageService.get(+this.visitedBefore).price
    }else{
      this.subscriptionValue = this.packageService.pacakeFinalPrice(this.packageService.packageType.value);
      this.subscriptionName =this.packageService.getPackageName(this.packageService.packageType.value);
      this.pricee=this.packageService.get(this.packageService.packageType.value).price
    }
  
    this.packageService.packageType.subscribe((val) => {
      this.packageType = val;
      console.log("Package Type", val)
    });
    this.packageDetails = this.packageService.get(this.packageType);
    if(this.user.subscription_plan== 'Monthly' || this.user.subscription_plan== 'Yearly'){
      this.noOfEmployees = +this.noOfEmployees ? this.noOfEmployees : 1;
    }else{
      this.visitedBefore = localStorage.getItem('packageType')
      this.noOfEmployees = 1;
      this.userAmmount =  this.visitedBefore==0 ? 3 : 30
    }
    
    this.totalAmmount=this.packageService.pacakeFinalPrice(this.packageService.packageType.value)
           console.log("this.totalAmmount",this.totalAmmount)
  }

  get f() { return this.paymentForm.controls; }

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
            if(this.selectedLanguage == 'en'){
              alert('Payment has been successfull!');
            }else{
              alert('¡El pago ha sido exitoso!');
            }
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  cardValidation() {
    if (this.paymentForm.controls.cardNumber.value.toString().match(this.matserCardRegex) == null &&
      this.paymentForm.controls.cardNumber.value.toString().match(this.visacardRegex) == null &&
      this.paymentForm.controls.cardNumber.value.toString().match(this.americanExpressRegex == null)) {
      return true;
    }
    return false;

  }

  validation() {
    if (this.paymentForm.controls.nameOnCard.errors?.required) {
      if(this.selectedLanguage == 'en'){
        this.tostar.custom('Name on card is required1');
      }else{
        this.tostar.custom('El nombre en la tarjeta es obligatorio.');
      }
    }
    else if (this.paymentForm.controls.nameOnCard.value.toString().match(this.nameRegex) == null) {
      if(this.selectedLanguage == 'en'){
        this.tostar.custom('Please Enter Valid name');
      }else{
        this.tostar.custom('Por favor, ingrese un nombre válido');
      }
    }
    else if (this.paymentForm.controls.cardNumber.errors?.required) {
      if(this.selectedLanguage == 'en'){
        this.tostar.custom('Card Number is required');
      }else{
        this.tostar.custom('El número de tarjeta es obligatorio.');
      }
    } else if (this.cardValidation()) {
      if(this.selectedLanguage == 'en'){
        this.tostar.custom('Invalid Card Number');
      }else{
        this.tostar.custom('Número de tarjeta inválido.');
      }
    }
    else if (this.paymentForm.controls.expiry.errors?.required) {
      if(this.selectedLanguage == 'en'){
      this.tostar.custom('Card Expiry is required');
      }else{
        this.tostar.custom('La fecha de vencimiento de la tarjeta es obligatoria.');
      }
    }
    else if (this.paymentForm.controls.expiry.value.toString().match(this.expiryDateRegex) == null) {
      if(this.selectedLanguage == 'en'){
        this.tostar.custom('Card Expiry Date is not valid');
        }else{
          this.tostar.custom('La fecha de vencimiento de la tarjeta no es válida');
        }
    }
    else if (this.paymentForm.controls.cvv.errors?.required) {
      if(this.selectedLanguage == 'en'){
        this.tostar.custom('CVV is required');
        }else{
          this.tostar.custom('Se requiere CVV');
        }
    }
    else if (this.paymentForm.controls.cvv.errors?.maxLength) {
      if(this.selectedLanguage == 'en'){
      this.tostar.custom('CVV does not contain more than 3 numbers');
        }else{
          this.tostar.custom('CVV no contiene más de 3 números');
        }
    }
    else if (this.paymentForm.controls.cvv.value.toString().match(this.cvvRegex) == null) {
      this.tostar.custom(this.selectedLanguage === 'en' ? 'CVV is not valid' : 'CVV no es válido');
    }
    else if (this.paymentForm.controls.streetAddress.errors?.required) {
      this.tostar.custom('Billing Address is required');
      this.tostar.custom(this.selectedLanguage === 'en' ? 'Billing Address is required' : 'Se requiere dirección de facturación');

    }
    else if (this.paymentForm.controls.state.errors?.required) {
      this.tostar.custom(this.selectedLanguage === 'en' ? 'State/Province Number is required' : 'Se requiere el número de estado/provincia');

    }
    else if (this.paymentForm.controls.city.errors?.required) {
      this.tostar.custom(this.selectedLanguage === 'en' ? 'City is required' : 'Se requiere ciudad');

    }
    else if (this.paymentForm.controls.zipCode.errors?.required) {
      this.tostar.custom('Zip Code is required');
      this.tostar.custom(this.selectedLanguage === 'en' ? 'Zip Code is required' : 'Se requiere código postal');

    }
    else if (this.paymentForm.controls.zipCode.value.toString().match(this.usZipCode) == null) {
      this.tostar.custom('Invalid Zip Code');
      this.tostar.custom(this.selectedLanguage === 'en' ? 'Invalid Zip Code' : 'Código postal no válido');

    }
  }
  backToHome() {
    this.router.navigate(['/'])
  }

  private setPackage() {
    this.packageService.isTrial.next(this.packageService.isTrial.value);
    this.packageService.packageType.next(this.packageService.packageType.value);
  }

  // onTypeChange(newValue: any) {
  //   this.selectedType = +newValue.target.value;
  //   console.log("this.selectedType",this.selectedType);
  // }

  makePayment() {
    // this.noOfEmployees = this.packageService.get(this.packageService.packageType.value).employees
    if(this.trial){
      this.noOfEmployees = 1;
      this.subscriptionValue = 0;
      this.subscriptionName = 'Monthly';
    }else{
      this.visitedBefore = localStorage.getItem('packageType')
      if(this.packageService.packageType.value === undefined ||this.packageService.packageType.value === null){
        this.subscriptionValue = this.packageService.pacakeFinalPrice(+this.visitedBefore)
        this.subscriptionName =this.packageService.getPackageName(+this.visitedBefore)
      }else{
        this.subscriptionValue = this.packageService.pacakeFinalPrice(this.packageService.packageType.value)
        this.subscriptionName =this.packageService.getPackageName(this.packageService.packageType.value)
      }
    }
  
    this.submitted = true;
    if (this.paymentForm.invalid) {
      this.validation();
      return;
    }
    // if (this.packageService.isTrial.value == undefined) {
    //   this.tostar.somethingWentWrong();
    //   return false;
    // }

// if(this.user.subscription_plan== 'Monthly' || this.user.subscription_plan== 'Yearly'){

//   this.repo.updatePayment('subscription/update-payment',this.subscriptionValue,this.subscriptionName,this.noOfEmployees)
//   .pipe(first())
//   .subscribe(
//     data => {
//       const res: any = data;
//       localStorage.setItem('payment', JSON.stringify('done'))
//       this.spinner.hide();
//       this.paymentmail();
//       window.location.reload();
//       this.tostar.custom('Payment has been successfull');
//     },
//     error => {
//       this.spinner.hide();
//       this.tostar.custom(error.error.msg);
//       this.router.navigate(['']);
//     });
// }else{
  this.repo.makePayment('subscription/make-payment',this.subscriptionValue,this.subscriptionName,this.noOfEmployees)
  .pipe(first())
  .subscribe(
    data => {
      const res: any = data;
      localStorage.setItem('payment', JSON.stringify('done'))
      this.spinner.hide();
      this.paymentmail();
      window.location.reload();
      this.tostar.custom('Payment has been successfull');
    },
    error => {
      this.spinner.hide();
      this.tostar.custom(error.error.msg);
      this.router.navigate(['']);
    });
// }
  

    this.setPackage();
    this.router.navigate(['/subscription-successfull']);

  }

  updateEmployeeCount(){
   this.isInputChange= true;
    if(this.packageService.packageType.value === undefined ||this.packageService.packageType.value === null){
      let pack = this.packageService.updateEmployee(+this.visitedBefore,this.noOfEmployees);
    }else{
      let pack = this.packageService.updateEmployee(this.packageService.packageType.value,this.noOfEmployees);
    }
  }

  proceedToPay() {
    if (this.packageService.isTrial.value == undefined)
      return false;
    this.packageService.isTrial.next(this.packageService.isTrial.value);
    this.packageService.packageType.next(this.packageService.packageType.value);
    this.router.navigate(['/payment-option']);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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


paymentmail(){
  this.repo.paymentmail('company/mail')
  .pipe(first())
  .subscribe(
    data => {
      const res: any = data;
      localStorage.setItem('payment', JSON.stringify('done'))
      this.spinner.hide();
    },
    error => {
      this.spinner.hide();
      this.tostar.custom(error.error.msg);
      this.router.navigate(['']);
    });
}

  subscriptionValue:any
  stripeToken:any
  subscriptionName:any
  amount:any
  makePaymentByStripe() {
    if(this.trial){
      this.noOfEmployees = 1;
      this.subscriptionValue = 0;
      this.subscriptionName = 'Monthly';
    }else{
      this.visitedBefore = localStorage.getItem('packageType')
      if(this.packageService.packageType.value === undefined ||this.packageService.packageType.value === null){
        this.amount = this.packageService.pacakeFinalPrice(+this.visitedBefore)
        this.subscriptionValue = this.packageService.pacakeFinalPrice(+this.visitedBefore)
        this.subscriptionName =this.packageService.getPackageName(+this.visitedBefore)
    
      }else{
      this.amount = this.packageService.pacakeFinalPrice(this.packageService.packageType.value)
      this.subscriptionValue = this.packageService.pacakeFinalPrice(this.packageService.packageType.value)
      this.subscriptionName =this.packageService.getPackageName(this.packageService.packageType.value)
      }
    }
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.key,
      locale: 'auto',
      token: (stripeToken: any) => { 
        this.stripeToken= stripeToken.id
        if (stripeToken) {
          this.spinner.show();
          this.repo.payment('subscription/payment',this.noOfEmployees,this.subscriptionName,this.subscriptionValue)
          .pipe(first())
          .subscribe(
            data => {
              const res: any = data;
              this.spinner.hide();
              this.tostar.custom('Payment has been successfull');
              this.paymentmail()
              this.router.navigate(['']);
            },
            error => {
              this.spinner.hide();
              this.tostar.custom(error.error.msg);
              this.router.navigate(['']);
            });
        }
      },
    });

  
    paymentHandler.open({
      name: 'BrainyClock',
      description: this.packageService.getPackageName(this.packageService.packageType.value) + ' ' + 'Package',
      // amount: this.packageDetails.price * 12 * parseFloat(amount),
      amount:  parseFloat(this.amount) * 100,
    });
   
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
  userAmmount:any
  getOrder(){
    if(this.user){
      this.repo.getData('orders', this.user.company_id)
      .pipe(first())
      .subscribe(
        data => {
          const res: any = data;
          if(res.data.length>0){
            this.user.subscription_plan= res.data[0]?.subscription_plan;
            this.noOfEmployees=res.data[0]?.employees
            this.userAmmount= Math.round(res.data[0]?.amount);
          }
          this.spinner.hide();
          if (data["success"] != true) {
            this.tostar.custom(data['msg']);
            return false;
          }
        },
        error => {
          this.spinner.hide();
          this.tostar.custom(error.error.msg);
          return false;
        });
    return true;
    this.spinner.show();

    }
    
  }

}
