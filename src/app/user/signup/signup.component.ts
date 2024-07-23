import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { RepositoryService } from 'src/app/services/repository.service';
import { MustMatch } from 'src/app/services/passwordMatchValidator';
import { LoginService } from 'src/app/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/services/spinner.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() editedEmitter = new EventEmitter<boolean>();
  public showPassword: boolean;
  public showConfirmPassword: boolean;
  signupForm: FormGroup;
  submitted = false;
  supportLanguage = ['en', 'fr','es','hi'];

  constructor(private toastr: ToastrService,
     private spinner: SpinnerService,
      private login: LoginService,
       private guard: AuthGuard,
        private router: Router,
         private formBuilder: FormBuilder,
          private repo: RepositoryService,
      private translateService: TranslateService,
          
) { 
  this.translateService.addLangs(this.supportLanguage);
  this.translateService.setDefaultLang('en');
}

  ngOnInit(): void {
    const storedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.translateService.use(storedLanguage);
      
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      name: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      // companyName:[''],
      region:[''],
    },
      { validator: [MustMatch('password', 'confirmPassword')] });
  }
  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.spinner.show();
    this.f.name.setValue(this.f.firstName.value + ' ' + this.f.lastName.value);

    this.repo.post('company/signup', this.signupForm.value)
      .pipe(first())
      .subscribe(
        data => {
          const res: any = data;
          if (res["success"] == true) {
            this.login.login({ email: this.f.email.value, password: this.f.password.value })
              .subscribe(data => {
                this.Close();
              });
            this.spinner.hide();
            this.toastr.success(res['msg']);
          }
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
    this.signupForm.reset();
    this.editedEmitter.emit(false);
  }
  updateValueFromLogin(val: { login, signup }) {
    this.isShow = val.signup;
  }
}
