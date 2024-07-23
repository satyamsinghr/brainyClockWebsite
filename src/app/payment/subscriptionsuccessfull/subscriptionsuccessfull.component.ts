import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageService } from 'src/app/services/packages.service';
import { Package } from 'src/app/model/package.model';
import { RepositoryService } from 'src/app/services/repository.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TostarService } from 'src/app/services/tostar.service';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-subscriptionsuccessfull',
  templateUrl: './subscriptionsuccessfull.component.html',
  styleUrls: ['./subscriptionsuccessfull.component.css']
})
export class SubscriptionsuccessfullComponent implements OnInit {

  packageType: any;
  userEmail:any
  trial : boolean = true
  packageDetails: Package;
  supportLanguage = ['en','es'];

  constructor(public packageService: PackageService,
     private spinner: NgxSpinnerService,
     private tostar: TostarService,
     private router: Router,
      private repo: RepositoryService,
      private translateService: TranslateService,
    ) {
      this.translateService.addLangs(this.supportLanguage);
      this.translateService.setDefaultLang('en');
     }
  user:any
  ngOnInit(): void {
    const storedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.translateService.use(storedLanguage);
    this.user = JSON.parse(localStorage.getItem('user'));
    this.trial = JSON.parse(localStorage.getItem('isTrial'));
    this.userEmail = JSON.parse(localStorage.getItem('user'));
    // this.trial = this.packageService.isTrial.value
    this.packageService.packageType.subscribe((val) => {
      this.packageType = val;
    });
    this.packageDetails = this.packageService.get(this.packageType);
    this.getOrder()
  }

  backToHome(){
    // this.router.navigate(['/'])
    window.open("http://www.portal.brainyclock.com")
  }
  gotoOrderDetail(){
    this.packageService.isTrial.next(this.packageService.isTrial.value);
    this.packageService.packageType.next(this.packageService.packageType.value);
    this.router.navigate(['/order-detail'])
  }

  userAmmount:any
  orderNo:any
  subscriptionPlan:any
  orderdetails:any
  getOrder(){
    if(this.user){
      this.repo.getData('orders', this.user.company_id)
      .pipe(first())
      .subscribe(
        data => {
          const res: any = data;
          this.orderdetails=res.data;
          // Assuming orderdetails is an array of objects
const latestOrder = this.orderdetails.reduce((latest, current) => {
  // Compare created_at values
  const latestDate = new Date(latest.created_at);
  const currentDate = new Date(current.created_at);

  // Return the object with the later created_at value
  return latestDate > currentDate ? latest : current;
}, {});

console.log("Latest Order:", latestOrder);

          this.subscriptionPlan=latestOrder?.subscription_plan;
          this.userAmmount= Math.round(latestOrder?.amount);
          this.orderNo= latestOrder?.order_no;

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
