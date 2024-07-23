import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { APP_BASE_HREF } from '@angular/common';
import { ContactComponent } from './contact/contact.component';
import { GetappComponent } from './getapp/getapp.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { ForgotpasswordComponent } from './user/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './user/resetpassword/resetpassword.component';
import { ResetpasswordlinkComponent } from './user/resetpasswordlink/resetpasswordlink.component';
import { ResetsuccessfullloginComponent } from './user/resetsuccessfulllogin/resetsuccessfulllogin.component';
import { JwtModule } from "@auth0/angular-jwt";
import { AuthGuard } from "../app/auth/auth.guard";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { MainComponent } from './main/main.component';
import { MainwithoutfooterComponent } from './mainwithoutfooter/mainwithoutfooter.component';
import { TrybeforebuyComponent } from './user/trybeforebuy/trybeforebuy.component';
import { CheckoutComponent } from './payment/checkout/checkout.component';
import { PaymentoptionComponent } from './payment/paymentoption/paymentoption.component';
import { SubscriptionsuccessfullComponent } from './payment/subscriptionsuccessfull/subscriptionsuccessfull.component';
import { OrderdetailComponent } from './payment/orderdetail/orderdetail.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ChangepasswordComponent } from './user/changepassword/changepassword.component';
import { TransactionhistoryComponent } from './user/transactionhistory/transactionhistory.component';
import { PaymentdetailsComponent } from './user/paymentdetails/paymentdetails.component';
import { MysubscriptionsComponent } from './user/mysubscriptions/mysubscriptions.component';
import { ScrollService } from './services/scroll.service';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';

// For translate

export function tokenGetter() {
  return localStorage.getItem("jwt");
}
const googleLoginOptions = {
  scope: 'profile email',
  plugin_name: 'login' //you can use any name here
};
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    GetappComponent,
    LoginComponent,
    SignupComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    ResetpasswordlinkComponent,
    ResetsuccessfullloginComponent,
    MainComponent,
    MainwithoutfooterComponent,
    TrybeforebuyComponent,
    CheckoutComponent,
    PaymentoptionComponent,
    SubscriptionsuccessfullComponent,
    OrderdetailComponent,
    ProfileComponent,
    ChangepasswordComponent,
    TransactionhistoryComponent,
    PaymentdetailsComponent,
    MysubscriptionsComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    ToastrModule.forRoot(),

    // ToastrModule.forRoot({
    //   toastClass: 'toast toast-bootstrap-compatibility-fix'
    // }),
    NgxSpinnerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        disallowedRoutes: []
      }
    }),
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    )

  ],
  providers: [ScrollService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '895716370843-ijuf5efttnlcvlf31ecasph84mh6f2hj.apps.googleusercontent.com',
              googleLoginOptions
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    { provide: APP_BASE_HREF, useValue: '/' }, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
