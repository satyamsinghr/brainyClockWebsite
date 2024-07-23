import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RepositoryService } from 'src/app/services/repository.service';
import { MustMatch } from 'src/app/services/passwordMatchValidator';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TostarService } from 'src/app/services/tostar.service';
import { first } from 'rxjs/operators';
import { Package } from 'src/app/model/package.model';
import { PackageService } from 'src/app/services/packages.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  submitted = false;
  public showPassword: boolean;
  changePasswordForm: FormGroup;
  tab: string = 'change-password';
  public showHidePassword: boolean;
  public showHideConfPassword: boolean;
  supportLanguage = ['en','es'];

  packageType: any;
  userEmail: any
  trial: boolean = true
  packageDetails: Package;
  user: any
  userAmmount: any
  orderNo: any
  subscriptionPlan: any
  orderdetails: any
  constructor(private formBuilder: FormBuilder,
      private spinner: SpinnerService,
      private tostar: TostarService,
      private repo: RepositoryService,
      private translateService: TranslateService,
      public packageService: PackageService) {
        this.translateService.addLangs(this.supportLanguage);
        this.translateService.setDefaultLang('en');
       }

  ngOnInit(): void {

    const storedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.translateService.use(storedLanguage);

    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    },
      { validator: [MustMatch('newPassword', 'confirmPassword')] });



    this.user = JSON.parse(localStorage.getItem('user'));

    this.trial = JSON.parse(localStorage.getItem('isTrial'));
    this.userEmail = JSON.parse(localStorage.getItem('user'));
    // this.trial = this.packageService.isTrial.value
    this.packageService.packageType.subscribe((val) => {
      this.packageType = val;
    });
    this.packageDetails = this.packageService.get(this.packageType);
    this.getOrder();
    this.getCompanySubscription();
  }

  get f() { return this.changePasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.spinner.show();
    this.repo.post('company/change-password', this.changePasswordForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.spinner.hide();
          this.tostar.custom(data['msg']);
          if (data['success'] === true)
            this.Reset();
        },
        error => {
          this.spinner.hide();
          this.tostar.custom(error.error.msg);
        });

  }

  Reset() {
    this.submitted = false;
    this.changePasswordForm.reset();
  }

  openSubscription() {
    this.tab = 'my-subscriptions';
  }
  openPaymentDetails() {
    this.tab = 'payment-details';

  }
  openTransactionHistory() {
    this.tab = 'transaction-history';

  }
  openPasswordSection() {
    this.tab = 'change-password';

  }
  latestOrder:any
  subscriptionPlanVal:any
  subscriptionDate:any
  subscriptionEndDateYarly:any
  subscriptionEndDateMonthly:any
  getOrder() {
    if (this.user) {
      this.repo.getData('orders', this.user.company_id)
        .pipe(first())
        .subscribe(
          data => {
            const res: any = data;
            this.orderdetails = res.data;
            this.subscriptionPlan = res.data[0]?.subscription_plan;
            this.userAmmount = Math.round(res.data[0]?.amount);
            this.orderNo = res.data[0]?.order_no;
            this.latestOrder = this.orderdetails.reduce((latest, current) => {
              return new Date(latest.created_at) > new Date(current.created_at) ? latest : current;
            });
            this.subscriptionPlanVal = this.latestOrder.subscription_plan;
            this.subscriptionDate = new Date(this.latestOrder.created_at);
            
            this.subscriptionEndDateYarly = new Date(this.subscriptionDate);
            this.subscriptionEndDateYarly.setFullYear(this.subscriptionDate.getFullYear() + 1);
            
            this.subscriptionEndDateMonthly = new Date(this.subscriptionDate);
            this.subscriptionEndDateMonthly.setMonth(this.subscriptionDate.getMonth() + 1);
            
               
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
  companySubscription:any;
  getCompanySubscription() {
    if (this.user) {
      this.repo.getCompanySubscription('subscription/company', this.user.company_id)
        .pipe(first())
        .subscribe(
          data => {
            const res: any = data;
            this.companySubscription = res.data;
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

  downloadReceipt(order: any) {
    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.setFontSize(30);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Invoice', 40, 30);  

    const logoImage = new Image();
    logoImage.src = '/assets/images/brainyclock-logo-blue.png';
    pdf.addImage(logoImage, 'JPEG', pdf.internal.pageSize.getWidth() - 160, 10, 120, 40); 
// Add left side labels
pdf.setFontSize(12);
pdf.setFont('helvetica', 'bold');
pdf.text(`BILL TO:`, 40, 100);
pdf.setFont('helvetica', 'normal');
// pdf.text(`BILL TO:`, 40, 100);
pdf.text(`Name:${ this.user.name}`, 40, 120);
pdf.text(`Payment method:${order.payment_method}`, 40, 140);
pdf.text(`Subscription Plan:${order.subscription_plan}`, 40, 160);

// Add right side values
pdf.setFont('helvetica', 'normal');
pdf.text(`Company Name: ${this.user.company_name}`, 350, 100);
pdf.text(`Order No: ${order.order_no}`, 350, 120);
pdf.text(`Employees: ${order.employees}`, 350, 140);
pdf.text(`Created At: ${order.created_at}`, 350, 160);

pdf.setLineWidth(1);
pdf.line(40, 180, pdf.internal.pageSize.getWidth() - 40, 180);

// Add table heading
pdf.setFontSize(12);
pdf.setFont('helvetica', 'bold');
pdf.text('Order No', 40, 200);
pdf.text('Payment method', 230, 200);
pdf.text('Amount', 450, 200);

pdf.setFontSize(12);
pdf.setFont('helvetica', 'normal');
pdf.text(`${order.order_no}`, 38, 220);
pdf.text(`${order.payment_method}`, 265, 220);
pdf.text(`$${order.amount}`, 450, 220);

// Add space and lines
pdf.setLineWidth(1);
pdf.line(40, 380, pdf.internal.pageSize.getWidth() - 40, 380);
pdf.text(' ', 40, 250); // Add some space

// Display Total amount
pdf.setFontSize(14);
pdf.setFont('helvetica', 'bold');
pdf.text('Total Amount:', 40, 400);
pdf.text(`$${order.amount}`, 450, 400);
    // Save the PDF
    pdf.save(`invoice_${order.id}.pdf`);
  }


}
