import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { MustMatch } from 'src/app/services/passwordMatchValidator';
import { RepositoryService } from 'src/app/services/repository.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TostarService } from 'src/app/services/tostar.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  restPasswordForm: FormGroup;
  submitted = false;
  constructor(private tostar: TostarService, private spinner: SpinnerService, private route: ActivatedRoute,
    private router: Router, private formBuilder: FormBuilder, private repo: RepositoryService) { }


  ngOnInit(): void {
    this.restPasswordForm = this.formBuilder.group({
      confirmationCode: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    },
      { validator: [MustMatch('password', 'confirmPassword')] });
    //  this.validation();
  }
  validation() {
    this.route.queryParams
      .subscribe(params => {
        if (params.email != null) {
          this.f.email.setValue(params.email);
        }
        else if (params.code == null && localStorage.getItem('access_token') == null) {
          this.tostar.custom("reset password link is incorrect");
        }
      }
      );
  }
  get f() { return this.restPasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.restPasswordForm.invalid) {
      return;
    }
    this.spinner.show();
    this.repo.post('company/reset-password', this.restPasswordForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data["success"] == true) {
            this.spinner.hide();
            this.tostar.custom(data['msg']);
          }
        },
        error => {
          this.spinner.hide();
          this.tostar.custom(error.error.msg);
        });

  }

}
