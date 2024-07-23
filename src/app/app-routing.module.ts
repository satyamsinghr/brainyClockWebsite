import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GetappComponent } from './getapp/getapp.component';
import { ResetpasswordComponent } from './user/resetpassword/resetpassword.component';
import { MainComponent } from './main/main.component';
import { ResetsuccessfullloginComponent } from './user/resetsuccessfulllogin/resetsuccessfulllogin.component';
import { MainwithoutfooterComponent } from './mainwithoutfooter/mainwithoutfooter.component';
import { TrybeforebuyComponent } from './user/trybeforebuy/trybeforebuy.component';
import { CheckoutComponent } from './payment/checkout/checkout.component';
import { PaymentoptionComponent } from './payment/paymentoption/paymentoption.component';
import { AuthGuard } from './auth/auth.guard';
import { IsSignedInGuard } from './auth/sigin.guard';
import { SubscriptionsuccessfullComponent } from './payment/subscriptionsuccessfull/subscriptionsuccessfull.component';
import { OrderdetailComponent } from './payment/orderdetail/orderdetail.component';
import { ProfileComponent } from './user/profile/profile.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';


const routes: Routes = [
  {
    path: '', children: [
      { path: '', component: HomeComponent },
      { path: 'get-app', component: GetappComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
      { path: 'payment-option', component: PaymentoptionComponent, canActivate: [AuthGuard] },
      { path: 'subscription-successfull', component: SubscriptionsuccessfullComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    ], component: MainComponent
  },
  {
    path: '', children: [
      // { path: 'reset-login', component: ResetsuccessfullloginComponent, canActivate: [IsSignedInGuard] },
       { path: 'reset-login', component: ResetsuccessfullloginComponent },
      { path: 'try-before-buy', component: TrybeforebuyComponent, canActivate: [IsSignedInGuard] }
    ],
    component: MainwithoutfooterComponent
  },
  { path: 'order-detail', component: OrderdetailComponent, canActivate: [AuthGuard] },
  // { path: 'reset-password', component: ResetpasswordComponent, canActivate: [IsSignedInGuard] },
  { path: 'reset-password', component: ResetpasswordComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
