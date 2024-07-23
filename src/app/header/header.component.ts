import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../model/user.model';
import { HostListener } from "@angular/core";
import { NavigationStart, Router } from '@angular/router';
import { ScrollService } from '../services/scroll.service';
import { SocialAuthService } from "angularx-social-login";
import { element } from 'protractor';
import { PackageService } from '../services/packages.service';
import {TranslateService} from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  isMobile = false;
  isShowLogin = false;
  isShowSignup = false;
  isLoggedIn: Observable<boolean>;
  screenWidth: number;
  componentscurrentUrl = '/'
  user: Observable<User>;
  public currentURL: any = "";
  homeUrlStatus: boolean = true;
  trial: boolean;
  url:any
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    if (window.innerWidth < 500)
      this.isMobile = true;
    else
      this.isMobile = false;
  }
  supportLanguage = ['en','es'];
  selectedLanguage: string = 'en';
  constructor(
    private guard: AuthGuard,
    private router: Router,
    private scrollService: ScrollService,
    private _authService: SocialAuthService,
    private packageService: PackageService,
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {
    
    this.getScreenSize();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCurrentUrl();
    });
    this.translateService.addLangs(this.supportLanguage);
    this.translateService.setDefaultLang('es');
  }

  private updateCurrentUrl() {
    this.componentscurrentUrl = this.router.url;
    if (this.componentscurrentUrl.length > 1) {
      this.homeUrlStatus = false;
    } else {
      this.homeUrlStatus = true;
    }
    console.log("Current URL:", this.componentscurrentUrl);
  }

 
  userName:any
  ngOnInit(): void {
    this.updateCurrentUrl()
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      this.selectedLanguage = storedLanguage;
      this.translateService.use(storedLanguage);
    } else {
      this.selectedLanguage = 'en';
      this.translateService.use(this.selectedLanguage);
    }
    this.user = this.guard.UserInfo();
    this.trial = JSON.parse(localStorage.getItem('isTrial'));
     this.url = this.router.url;
    this.isLoggedIn = this.guard.isUserAuthenticated();
    this.isLoggedIn = this.guard.isUserAuthenticate;
    if (this.guard.isUserAuthenticate) {
      this.guard.isUserAuthenticate.subscribe(data => {
        this.user = this.guard.UserInfo();
      });
    }
    if(this.user)
    this.user.subscribe((data: any) => {
      console.warn("User", data)
      this.userName = data.name
    });

  }

  selectLang(event: any): void {
    this.languageService.setLanguage(event);
    localStorage.setItem('selectedLanguage', event);
    this.selectedLanguage = event
  }


  // ngAfterViewInit(){
  //   this.router.events.subscribe((res) => {
  //     this.componentscurrentUrl = this.router.url;
  //   });
  // }

  paymentDone() {
    return (localStorage.getItem('payment')) ? true : false;
  }

  logout(): void {
    if (localStorage.getItem('user')) localStorage.removeItem('user');
    if (localStorage.getItem('jwt'))  localStorage.removeItem('jwt');
    if (localStorage.getItem('userId'))  localStorage.removeItem('userId');
    if (localStorage.getItem('packageType')) localStorage.removeItem('packageType');
    if (localStorage.getItem('payment')) localStorage.removeItem('payment');
    if (localStorage.getItem('isTrial')) localStorage.removeItem('isTrial');
    // if (localStorage.getItem('selectedLanguage')) localStorage.removeItem('selectedLanguage');
    this.isShowLogin = false;
    this.user = this.guard.UserInfo();
    this.isLoggedIn = this.guard.isUserAuthenticated();
    this.isLoggedIn = this.guard.isUserAuthenticate;
    this._authService.signOut();
    this.guard.isUserAuthenticate.subscribe(data => {
      this.user = this.guard.UserInfo();
      this.router.navigate(['/']);
    })
    window.location.reload();
  }

  ShowLogin() {
    this.isShowLogin = true;
  }
  ShowSignup() {
    this.isShowSignup = true;

  }
  updateValueFromLogin(val: { login, signup }) {
    this.isShowSignup = val.signup;
    if (val.signup != undefined)
      setTimeout(() => {
        this.isShowLogin = val.login;
      }, 400);
    else
      this.isShowLogin = val.login;
  }
  updateValueSignup(val: boolean) {
    this.isShowSignup = val;
  }
  scrollToId(id: string) {
    console.log("element id : ", id);
    this.scrollService.scrollToElementById(id);
  }
  scrollToElement(element: HTMLElement) {
    this.scrollService.scrollToElement(element);
  }

  goToDashboard() {
    window.open("http://www.portal.brainyclock.com")
  }
}
