import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubscriptionsuccessfullComponent } from './subscriptionsuccessfull.component';

describe('SubscriptionsuccessfullComponent', () => {
  let component: SubscriptionsuccessfullComponent;
  let fixture: ComponentFixture<SubscriptionsuccessfullComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionsuccessfullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsuccessfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
