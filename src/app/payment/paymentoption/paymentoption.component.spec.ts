import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentoptionComponent } from './paymentoption.component';

describe('PaymentoptionComponent', () => {
  let component: PaymentoptionComponent;
  let fixture: ComponentFixture<PaymentoptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentoptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentoptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
