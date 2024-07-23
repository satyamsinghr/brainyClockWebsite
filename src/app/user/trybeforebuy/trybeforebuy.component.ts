import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PackageType } from 'src/app/enum/packagetype.enum';
import { LoginService } from 'src/app/services/login.service';
import { PackageService } from 'src/app/services/packages.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-trybeforebuy',
  templateUrl: './trybeforebuy.component.html',
  styleUrls: ['./trybeforebuy.component.css']
})
export class TrybeforebuyComponent implements OnInit {

  trybeforebuyForm: FormGroup;
  submitted = false;
  public showPassword: boolean;
  @Output() editedEmitter = new EventEmitter<{}>();
  isShowForgotPassword = false;
  isShowSignup = false;
  isShowLogin = false;


  constructor(private packageService: PackageService, private login: LoginService, private toastr: ToastrService, private spinner: SpinnerService, private route: ActivatedRoute,
    private router: Router, private formBuilder: FormBuilder, private repo: RepositoryService) { }

  ngOnInit(): void {
    this.trybeforebuyForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]],
    });
  }

  get f() { return this.trybeforebuyForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.trybeforebuyForm.invalid) {
      return;
    }
    this.spinner.show();
    this.login.login({ email: this.f.email.value, password: this.f.password.value })
      .subscribe(data => {
        this.spinner.hide();
        if (data['success'] != undefined && data['success'] == true) {
          this.packageService.packageType.next(PackageType.Base);
          this.packageService.isTrial.next(true);
          this.router.navigate(['/checkout']);
        }
      });
    error => {
      this.spinner.hide();
    }

  }

  showForgotPassword(val: boolean) {
    this.isShowForgotPassword = val;
  }

  updateValueFromForgotPassword(val: { forgotPassword }) {

    this.isShowForgotPassword = val.forgotPassword;
  }
  showSignup(val: boolean) {
    this.isShowSignup = val;
    this.editedEmitter.emit({ login: false, signup: val });
  }
  updateValueSignup(val: boolean) {
    this.isShowSignup = val;
  }
  showLogin() {
    this.isShowLogin = true;
  }
  updateValueFromLogin(val: { login }) {
    this.isShowLogin = val.login;
  }
}
