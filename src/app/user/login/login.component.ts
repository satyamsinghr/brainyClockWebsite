import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RepositoryService } from "../../services/repository.service";
import { first } from 'rxjs/operators';
import { AuthenticatedResponse } from "../../model/AuthenticationModel.model";
import { User } from 'src/app/model/user.model';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SocialUser } from 'angularx-social-login';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() editedEmitter = new EventEmitter<{}>();
  isShowForgotPassword = false;
  isShowSignup = false;
  loginForm: FormGroup;
  submitted = false;
  isRememberBtn = false;
  user: SocialUser;
  loggedIn: boolean;
  public showPassword: boolean;
  supportLanguage = ['en', 'fr','es','hi'];

  constructor(
      private toastr: ToastrService,
      private guard: AuthGuard,
      private router: Router,
      private formBuilder: FormBuilder,
      private repo: RepositoryService,
      private translateService: TranslateService,
      private spinner: SpinnerService,
      private _authService: SocialAuthService
      ) { 
        this.translateService.addLangs(this.supportLanguage);
        this.translateService.setDefaultLang('en');
      }

  ngOnInit(): void {
    const storedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.translateService.use(storedLanguage);

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]],
    });
  }
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner.show();
    this.repo.post('company/login', this.loginForm.value)
      .pipe(first())
      .subscribe(
        data => {
          const res: any = data;
          localStorage.setItem("jwt", res.data.access_token);
          localStorage.setItem("user", JSON.stringify(res.data));
          localStorage.setItem("userId", JSON.stringify(res.data.company_id));
         
          this.guard.isUserAuthenticated().next(true);
          this.guard.UserInfo().next(<User>JSON.parse(JSON.stringify(res.data)));
          this.Close();
          this.router.navigate(['']);
          window.location.reload();
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.Close();
          this.toastr.success(error.error.msg);
        });

  }

  Close() {
    this.isShow = false;
    this.submitted = false;
    this.loginForm.reset()
    this.editedEmitter.emit({ login: this.isShow });
  }

  showSignup(val: boolean) {
    this.isShowSignup = val;
    this.editedEmitter.emit({ login: false, signup: val });
  }
  showForgotPassword(val: boolean) {
    this.isShowForgotPassword = val;
  }
  updateValueFromForgotPassword(val: { forgotPassword, login }) {

    this.isShowForgotPassword = val.forgotPassword;
    this.isShow = val.login;
    if (val.login != undefined)
      this.editedEmitter.emit({ login: val.login });
  }
  updateValueSignup(val: boolean) {
    this.isShowSignup = val;
  }
  rememberToggleBtn() {
    this.isRememberBtn = !this.isRememberBtn
  }
  signInWithGoogle(): void {
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user:any)=>{
      this.user = user;
       this.loggedIn = (user != null);
       if(typeof this.loggedIn!='undefined')
       {
        console.warn("this.loggedIn", user);
        // console.warn("id_token", user.idToken);
       }
    });
  }
}
