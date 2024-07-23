import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { first } from 'rxjs/operators';
import { AuthGuard } from '../auth/auth.guard';
import { PackageType } from '../enum/packagetype.enum';
import { PackageService } from '../services/packages.service';
import { RepositoryService } from '../services/repository.service';
import { SpinnerService } from '../services/spinner.service';
import { TostarService } from '../services/tostar.service';
import {TranslateService} from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  packageType = PackageType;
  supportLanguage = ['en','es'];
  selectedLanguage: string = 'en';
  constructor(private spinner: SpinnerService, 
    private repo: RepositoryService,
     public guard: AuthGuard, 
     private tostar: TostarService,
      public packageService: PackageService,
       private router: Router,
       private translateService: TranslateService,
       private languageService: LanguageService) {
        this.translateService.addLangs(this.supportLanguage);
        this.translateService.setDefaultLang('en');
        }
  user:any

  ngOnInit(): void {
    
    this.languageService.language$.subscribe(language => {
      this.selectedLanguage = language;
      this.translateService.use(language);
    });

    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      this.selectedLanguage = storedLanguage;
      this.translateService.use(storedLanguage);
    } else {
      this.selectedLanguage = 'en';
      this.translateService.use(this.selectedLanguage);
    }


    this.packageService.get(this.packageType.Monthly).users;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getOrder();
  }

  selectLang(event: any): void {
    this.languageService.setLanguage(event.value);
    localStorage.setItem('selectedLanguage', event.value);
  }

  checkout(type: PackageType, isTrial: boolean) {
    if (!this.guard.isSignedIn())
      this.tostar.pleaseloginbeforebuy();

    // if (isTrial && this.checkIsUserAvailableForTrial())
    //   return;
    localStorage.setItem('packageType', type.toString());
    localStorage.setItem('isTrial', String(isTrial));
    this.packageService.packageType.next(type);
    this.packageService.isTrial.next(isTrial);
    this.router.navigate(['/checkout'])
  }


  checkIsUserAvailableForTrial(): boolean {
    this.spinner.show();
    this.repo.getData('subscription/eligibility', this.guard.GetUserId())
      .pipe(first())
      .subscribe(
        data => {
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
  }

  getOrder(){
    if(this.user){
      this.repo.getData('orders', this.user.company_id)
      .pipe(first())
      .subscribe(
        data => {
          const res: any = data;
          this.user.subscription_plan= res.data[0].subscription_plan
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
